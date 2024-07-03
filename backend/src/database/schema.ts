import {  pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";


export const topics = pgTable("topics", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    section: text("section").notNull(),
    isDraft: boolean("isDraft").default(true).notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull()
})

export const articles = pgTable("articles", {
    id: uuid("id").primaryKey().defaultRandom(),
    originalArticleUrl: text("originalArticleUrl").notNull(),
    newsPortal: varchar("newsPortal", {length: 255}).notNull(),
    isDraft: boolean("isDraft").default(false).notNull(),
    topicId: uuid("topicId").references(() => topics.id)

})

export const subsections = pgTable("subsections", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    articleId: uuid("articleId").references(() => articles.id)
})


export const sources = pgTable("sources", {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    display: text("display").notNull(),
    admin: varchar("admin",  { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    articleId: uuid("articleId").references(() => articles.id)
})


export const contents = pgTable("contents", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    admin: varchar("admin",  { length: 255 }).notNull(),
    commitMessage: varchar("commitMessage", { length: 255 }).notNull(),
    subsectionId: uuid("subsectionId").references(() => subsections.id),
    isDraft: boolean("isDraft").notNull()
})

export const admins = pgTable("admins", {
    id: uuid("id").primaryKey().defaultRandom(),
    subId: text("subId").default(""),
    name: text("name").default(""),    
    email: text("email").notNull(),
    picture: text("picture").default("")
})