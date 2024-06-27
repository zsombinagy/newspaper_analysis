import {z} from "zod"

export const adminInfoSchema = z.object({
    sub: z.string(),
    name: z.string(),
    email: z.string().email()
})

export const messageSchema = z.object({
    msg: z.string()
})