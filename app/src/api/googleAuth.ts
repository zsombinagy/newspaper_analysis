import { safeFetch } from "$lib/http/safeFetch";
import {z} from "zod"
import { messageSchema, adminInfoSchema } from "../modell";

export const getUserInfo = (authToken: any) => 
    safeFetch({
        method: "GET",
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        schema: adminInfoSchema,
        authToken: authToken
    })



export const getAuthentication = (body: z.infer<typeof adminInfoSchema>) => 
    safeFetch({
        method: "POST",
        url: "http://localhost:3000/api/admin/login",
        schema: messageSchema,
        payload: body
    })