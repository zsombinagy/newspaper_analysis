import OpenAI from "openai";
import { safeParse } from "../lib/safeParse";
import { analysedArticle } from "../model";

type Article = {
    link: string,
    eredeti_cím: string,
    cím: string,
    források_nyelvezet: string,
    objektivitás: string,
    író_véleménye: string,
    kinek_szól: string
};

type ReplyType = {
    success: false,
    msg: string
}  | {
    success: true,
    data: Article[]
}


const extractJsonFromResponse = (response: string): string => {
    const jsonMatch = response.match(/\[.*\]/s);
    return jsonMatch ? jsonMatch[0] : '';
};



const openAI = new OpenAI({apiKey: process.env.OPENAI_KEY})



const dataSchema = `Type.Array(Type.Object({
                        link: Type.String(),
                        eredeti_cím: Type.String(),
                        cím: Type.String(),
                        források_nyelvezet: Type.String(),
                        objektivitás: Type.String(),
                        író_véleménye: Type.String(),
                        kinek_szól: Type.String()
                    }))`


const instructions =`Ön egy segítőkész asszisztens, aki a cikkeket, az objketivitás fényében, ezek a kritériumok alapján elemzi 1-2 mondatban:
                    cím megfelelő?, források és hivatkozások amelyekre hivatkozik a cikkben?, nyelvezet
                    és stílus?, objektivitás?, az író véleménye kiderül?, kinek szólhat?, az adatokat egy JSON arrayben add vissza, ne legyen szöveg hozzá: ${dataSchema} `





export const newAnalysisAI = async (links: string[]): Promise<ReplyType> => {
    const response = await openAI.chat.completions.create({
        messages: [{
            role: "system",
            content: `${instructions}: ${links.join(", ")}`
        }],
        model: "gpt-4"
    })

    const rawData = response.choices[0].message.content
    console.log("Ennek jónak kéne lennie: " + rawData)

    if(!rawData)
        return {success: false, msg: "Not get a content"}


    const content = JSON.parse(rawData)
    const result = safeParse(analysedArticle, content)


    if(!result.success)
        return {success: false, msg: "Failed the parse"}


    return {
        success: true,
        data: result.data
    }
}