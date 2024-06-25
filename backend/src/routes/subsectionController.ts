import { database } from "../database/setup";
import { contents, subsections } from "../database/schema";
import {newSubsectionSchema, patchSubsectionSchema } from "../model";
import { eq} from "drizzle-orm";
import Elysia from "elysia";
import { authController, AuthorizationError } from "./authorization";

export const subsectionController = new Elysia()
  .use(authController)
  .post("/api/topic/:articleId/subsection",  async ({admin, params: {articleId}, body}) => {
    if(!admin)
      throw new AuthorizationError()

    const subsection = body;

    const receivedSubsection = await database
      .insert(subsections)
      .values({
        title: subsection.title,
        articleId: articleId,
      })
      .returning();

    const subsectionId = receivedSubsection[0].id;
    const receivedContent = await database.insert(contents).values({
      subsectionId: subsectionId,
      admin: admin.name,
      commitMessage: subsection.contents.commitMessage,
      content: subsection.contents.content,
      isDraft: false
    }).returning();

    return { success: true,
      data: receivedSubsection,
      data2: receivedContent
    };
  }, {
    body: newSubsectionSchema
  })

  .patch("/api/topic/article/:subsectionId/content", async ({admin, params: {subsectionId}, body}) => {
    if(!admin)
      throw new AuthorizationError()

    const subsection = body

    const receivedSubsection = await database.update(subsections).set({
      title: subsection.title
    }).where(eq(subsections.id, subsectionId)).returning()

    if (receivedSubsection.length === 0)
        return {success: false, msg: "No such subsection id"}


    const receivedContent = await database.insert(contents).values({
      subsectionId: subsectionId,
      admin: admin.name,
      commitMessage: subsection.contents.commitMessage,
      content: subsection.contents.content,
      isDraft: subsection.contents.isDraft
    }).returning()

    return { success: true,
      data: receivedSubsection,
      data2: receivedContent
    }
    }, {
      body: patchSubsectionSchema
  })

  .delete("/api/topic/article/:subsectionId/content", async ({params: {subsectionId}, admin}) => {
    if(!admin)
      throw new AuthorizationError()


   await database
        .delete(contents)
        .where(eq(contents.subsectionId, subsectionId));
    const receivedSubsection = await database
        .delete(subsections)
        .where(eq(subsections.id, subsectionId)).returning();

    if ( receivedSubsection.length === 0)
        return {success: false, msg: "No such subsection id"}

    return {success: true, data: receivedSubsection}
})