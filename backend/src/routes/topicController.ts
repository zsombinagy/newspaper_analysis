import { database } from "../database/setup";
import {
  articles,
  contents,
  sources,
  subsections,
  topics,
} from "../database/schema";
import {
  isDraftBodySchema,
  newTopicSchema,
  TopicSchema,
} from "../model";
import { eq, } from "drizzle-orm";

import { Elysia } from "elysia";
import { authController, AuthorizationError } from "./authorization";

export const topicController = new Elysia()
  .use(authController)

  .post("/api/topic", async ({body, admin}) => {
    if(!admin)
      throw new AuthorizationError()

    const topic = body;

    const receivedTopic = await database
      .insert(topics)
      .values({
        title: topic.title,
        section: topic.section,
      })
      .returning();

    const topicId = receivedTopic[0].id;
    const articleArray = topic.articles;

    for (const article of articleArray) {
      const receivedArticle = await database
        .insert(articles)
        .values({
          originalArticleUrl: article.originalArticleUrl,
          newsPortal: article.newsPortal,
          topicId: topicId,
        })
        .returning();

      const articleId = receivedArticle[0].id;
      const subsectionArray = article.subsections;
      for (const subsection of subsectionArray) {
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
          isDraft: false,
        });
      }

      const sourceArray = article.sources;
      for (const source of sourceArray) {
        const receivedSource = await database.insert(sources).values({
          url: source.url,
          display: source.display,
          admin: admin.name,
          articleId: articleId,
        });
      }
    }

    return {success: true, data: receivedTopic};
  }, { 
    body: newTopicSchema
  })
  .patch("/api/:topicId",  async ({ params: {topicId}, body, admin }) => {
    if(!admin)
      throw new AuthorizationError()

    const topic = body;
  
    const receivedTopic = await database
      .update(topics)
      .set({
        title: topic.title,
        section: topic.section,
        isDraft: topic.isDraft,
      })
      .where(eq(topics.id, topicId))
      .returning();

    if (receivedTopic.length === 0) 
      return {success: false, msg: "No such topic id" }
  
    return {  success: true, data: receivedTopic,};
  }, {
    body: TopicSchema
  })
  
  .delete("/api/:topicId", async ({params: {topicId}, admin}) => {
    if(!admin)
      throw new AuthorizationError()
  
    const articleIdArray = await database
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.topicId, topicId));

    const subsectionIdArray = [];
  
    for (const articleId of articleIdArray) {
      const subsectionId = await database
        .select({ id: subsections.id })
        .from(subsections)
        .where(eq(subsections.articleId, articleId.id));

        console.log(subsectionId)
  
      subsectionIdArray.push(subsectionId);
    }
  
    for (const articleSubsections of subsectionIdArray) {
      for (const subsection of articleSubsections) {
        await database
          .delete(contents)
          .where(eq(contents.subsectionId, subsection.id));
        await database
          .delete(subsections)
          .where(eq(subsections.id, subsection.id));
      }
    }
  
    for (const article of articleIdArray) {
      const receivedSourceArray = await database
        .delete(sources)
        .where(eq(sources.articleId, article.id));
    }
  
    const receivedArticleArray = await database
      .delete(articles)
      .where(eq(articles.topicId, topicId))
      .returning();

    const receivedTopic = await database
      .delete(topics)
      .where(eq(topics.id, topicId))
      .returning();

      if (receivedTopic.length === 0) 
        return {success: false, msg: "No such topic id"}
  
    return {success: true, data: receivedTopic};
  })


 .patch("/api/updateTopic/:topicId", async ({ params: {topicId}, admin, body}) => {
    if(!admin)
      throw new AuthorizationError()

    const checkIsDraft = await database
      .select({ isDraft: topics.isDraft })
      .from(topics)
      .where(eq(topics.id, topicId));

    if (checkIsDraft.length === 0)
      return {success: false, msg: "No such topic id"}

    if (checkIsDraft[0].isDraft !== body.isDraft) {
      const receivedTopic = await database
        .update(topics)
        .set({ isDraft: body.isDraft, updatedAt: new Date() })
        .where(eq(topics.id, topicId));

      return {success: true, data: receivedTopic};
    }

    return {success: false, msg: "No difference"};
}, {
  body: isDraftBodySchema
});
