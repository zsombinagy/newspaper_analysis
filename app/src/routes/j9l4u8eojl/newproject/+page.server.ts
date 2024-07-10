import { redirect} from "@sveltejs/kit"
import type { RequestEvent } from "../../oauth/$types"
import { treaty } from "@elysiajs/eden"
import { type OPENAI } from "../../../../../backend/src/routes/openaiController"
import { PUBLIC_RPC_URL } from "$env/static/public"




export const load = async (event: RequestEvent) =>  {
    const {cookies} = event
    const session = cookies.get("session")
    
    if (!session) {
        
        throw redirect(302, '/j9l4u8eojl')

    } 
}

export const actions = {

    
    chatGPT: async(event: RequestEvent) =>{
        const {cookies, request} = event
        const session = cookies.get("session")
        const formData = await request.formData()
        const links = formData.get("links")

        if (!session) 
            throw redirect(302, '/j9l4u8eojl')    
     

        if (!links) 
            throw new Error("No links provided")

        
        const linksArray = JSON.parse(links as string);

        const app = treaty<OPENAI>(PUBLIC_RPC_URL)

        const responseChatGPT = await app.api.openai.analyses.post(linksArray, {
            headers: {
                authorization: `Bearer ${session}`
            }
        })

        if(!responseChatGPT.data)
            throw new Error("No data")

        if(!responseChatGPT.data.data)
            throw new Error(responseChatGPT.data.msg)


        return {
            form: {success: true, data: responseChatGPT.data.data}
        }
    }
}
