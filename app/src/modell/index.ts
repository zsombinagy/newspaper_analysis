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