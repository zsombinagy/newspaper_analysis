import Elysia from "elysia";
import { authController, AuthorizationError } from "./authorization";
import { linksArraySchema } from "../model";
import { newAnalysisAI } from "../openai";


export const openAIController = new Elysia()
    .use(authController)
    .post("/api/openai/analyses", async ({admin, body}) => {
        if(!admin)
            throw new AuthorizationError()


        const openAIResponse = await newAnalysisAI(body)

        if (!openAIResponse.success)
            return {success: false, msg: openAIResponse.msg}

        return {success: true, data: openAIResponse.data}

    }, {
        body: linksArraySchema
    })