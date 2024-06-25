import { database } from "../database/setup";
import { contents} from "../database/schema";
import { isDraftBodySchema, newContentSchema} from "../model";
import {Elysia} from "elysia";
import { authController, AuthorizationError } from "./authorization";
import { eq } from "drizzle-orm";


export const contentController = new Elysia()
  .use(authController)
  .post("/api/topic/article/:subsectionId/content",  async ({admin, body, params: {subsectionId}}) => {
    if (!admin)
        throw new AuthorizationError()

    const content = body;

    const receivedContent = await database.insert(contents).values({
      subsectionId,
      admin: admin.name,
      commitMessage: content.commitMessage,
      content: content.content,
      isDraft: content.isDraft
    }).returning();

    return {success: true, data: receivedContent}
  }, {
    body: newContentSchema,
  })

  .patch("/api/topic/article/:subsectionId/content", async ({admin, body, params: {subsectionId}}) => {
    if(!admin)
      throw new AuthorizationError()

    const checkIsDraft = await database
      .select({ isDraft: contents.isDraft })
      .from(contents)
      .where(eq(contents.subsectionId, subsectionId));

    if (checkIsDraft.length === 0)
      return {success: false, msg: "No such content id"}

    if (checkIsDraft[0].isDraft !== body.isDraft) {
      const receivedContent = await database
        .update(contents)
        .set({ isDraft: body.isDraft})
        .where(eq(contents.subsectionId, subsectionId));

      return {success: true, data: receivedContent  };
    }

    return {success: false, msg: "No difference"};
  }, {
    body: isDraftBodySchema
  })


