import { Type } from "@sinclair/typebox";
import { createInsertSchema } from "drizzle-typebox";
import { articles, topics } from "../database/schema";


export const SectionLiteral = Type.Union([
  Type.Literal("domesticPolicy"),
  Type.Literal("economy"),
  Type.Literal("foreignPolicy"),
]);

export const newContentSchema = Type.Object({
  content: Type.String(),
  commitMessage: Type.String(),
  isDraft: Type.Boolean()
});

export const newSourceSchema = Type.Object({
  url: Type.String({ format: "uri" }),
  display: Type.String(),
});

export const newSubsectionSchema = Type.Object({
  title: Type.String(),
  contents: newContentSchema
});

export const newArticleSchema = Type.Object({
  originalArticleUrl: Type.String({ format: "uri" }),
  newsPortal: Type.String(),
  subsections: Type.Array(newSubsectionSchema),
  sources: Type.Array(newSourceSchema),
});

export const newTopicSchema = Type.Object({
  title: Type.String(),
  section: SectionLiteral,
  articles: Type.Array(newArticleSchema),
});

const newContentWithIsDraftSchema = Type.Intersect([
  newContentSchema,
  Type.Object({
    isDraft: Type.Boolean()
  })
]);


export const patchSubsectionSchema = Type.Object({
  title: Type.String(),
  contents: newContentWithIsDraftSchema
});

export const TopicSchema = createInsertSchema(topics)


export const ArticleSchema = createInsertSchema(articles)


export const adminInfoSchema = Type.Object({  
  sub: Type.String(),
  name: Type.String(),
  email: Type.String()
})

export const newAdminSchema = Type.Object({
  newAdminEmail: Type.String({format: "email"}), 
})

export const tokenSchema = Type.Object({
  sub: Type.String(),
  name: Type.String(),
  email: Type.String({forma: "email"}),
  iat: Type.Number(),
  exp: Type.Number()
})

export const isDraftBodySchema = Type.Object({
  isDraft: Type.Boolean()
})



