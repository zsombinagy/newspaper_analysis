import { database } from "../database/setup";
import { sources } from "../database/schema";
import {newSourceSchema } from "../model";
import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { authController, AuthorizationError } from "./authorization";

export const sourceController = new Elysia()
  .use(authController)
  .post("/api/topic/:articleId/source", async ({admin, params: {articleId} ,body}) => {
    if (!admin)
      throw new AuthorizationError()

    const source = body;

    const receivedSource = await database
      .insert(sources)
      .values({
        url: source.url,
        display: source.display,
        admin: admin.name,
        articleId,
      })
      .returning();



    return {success: true, data: receivedSource};
  }, {
    body: newSourceSchema
  })

  .patch("/api/topic/article/source/:sourceId", async ({admin, params: {sourceId} ,body}) => {
    if (!admin)
      throw new AuthorizationError()

    const source = body

    const receivedSource = await database.update(sources).set({
      url: source.url,
      display: source.display,
      admin: admin.name
    }).where(eq(sources.id, sourceId)).returning()

    if (receivedSource.length === 0)
        return {success: false, msg: "No such source id"}


    return {success: true, data: receivedSource}

  }, {
  body: newSourceSchema
  })


  .delete("/api/topic/article/source/:sourceId", async ({admin, params: {sourceId} }) => {
    if (!admin)
      throw new AuthorizationError()

    const receivedSource = await database.delete(sources).where(eq(sources.id, sourceId)).returning()

    if (receivedSource.length === 0)
        return {success: false, msg: "No such source id"}

    return  {success: true, data: receivedSource}
  })