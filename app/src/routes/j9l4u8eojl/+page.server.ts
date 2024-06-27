import { redirect} from "@sveltejs/kit"
import { OAuth2Client } from "google-auth-library"
import { PUBLIC_CLIENT_SECRET,  PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_REDIRECT } from "$env/static/public"
import { adminInfo, isLoggedIn } from "../../stores/stores"
import type { RequestEvent } from "./$types"



export const load = async (event: RequestEvent) =>  {
    const {cookies} = event
    const session = cookies.get("session")
    if (session) {
        isLoggedIn.set(true)
        throw redirect(302, '/j9l4u8eojl/main')

    }
}


export const actions = {
    OAuth2: async()=>{

        const oAuth2Client = new OAuth2Client(
            PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_CLIENT_SECRET, PUBLIC_GOOGLE_REDIRECT
        )

        const authorizeURL = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope:'https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email',
            prompt: 'consent'
        })

        throw redirect(302,authorizeURL)
    }
}


