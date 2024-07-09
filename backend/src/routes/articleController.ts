import { database } from "../database/setup";
import { articles, contents, sources, subsections } from "../database/schema";
import { ArticleSchema, newArticleSchema } from "../model";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import {  AuthorizationError, authController } from "./authorization";

export const articleController = new Elysia()
  .use(authController)
  .post("/api/:topicId/article", async ({body, admin, params: {topicId}}) => {
      if (!admin)
        throw new AuthorizationError()


      const article = body;

      const receivedArticle = await database
        .insert(articles)
        .values({
          title: article.title,
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

      return {success: true, data: receivedArticle};
    },
    {
      body: newArticleSchema,
    }
  )
  .patch("/api/topic/:articleId", async ({body, params: {articleId}, admin}) => {
    if (!admin)
      throw new AuthorizationError()

      const article = body;

      const receivedArticle = await database
        .update(articles)
        .set({
          title: article.title,
          originalArticleUrl: article.originalArticleUrl,
          newsPortal: article.newsPortal,
          isDraft: article.isDraft,
        })
        .where(eq(articles.id, articleId))
        .returning();

        if (receivedArticle.length === 0)
          return {success: false, msg: "No such article id"}

      return {success: true, data: receivedArticle};
    },
    {
      body: ArticleSchema,
    }
  )
  .delete("/api/topic/:articleId", async ({params: {articleId}, admin}) => {
    if (!admin)
      throw new AuthorizationError()

  
      const subsectionIdArray = await database
        .select({ id: subsections.id })
        .from(subsections)
        .where(eq(subsections.articleId, articleId));
  
      if (subsectionIdArray.length === 0) 
        return {success: false, msg: "No such article id"}
  
      for (const subsection of subsectionIdArray) {
        await database
          .delete(contents)
          .where(eq(contents.subsectionId, subsection.id));
        await database
          .delete(subsections)
          .where(eq(subsections.id, subsection.id));
      }
  
      await database.delete(sources).where(eq(sources.articleId, articleId));
  
      const receivedArticle = await database
        .delete(articles)
        .where(eq(articles.id, articleId))
        .returning()


  
      return {success: true, data: receivedArticle};
    }
  );



