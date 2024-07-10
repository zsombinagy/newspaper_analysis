import {z} from "zod"

export const adminInfoSchema = z.object({
    sub: z.string(),
    name: z.string(),
    email: z.string().email(),
    picture: z.string()
})

export const messageSchema = z.object({
    msg: z.string()
})

export type AdminInfoType = z.infer<typeof adminInfoSchema> | null


export const analysedArticleSchema = z.object({
    link: z.string(),
    eredeti_cím: z.string(),
    cím: z.string(),
    források_nyelvezet: z.string(),
    objektivitás: z.string(),
    író_véleménye: z.string(),
    kinek_szól: z.string()
}).array()


export type ArticleAnalyesProp = z.infer<typeof analysedArticleSchema> | null
  