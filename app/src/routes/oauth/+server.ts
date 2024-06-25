
import {  redirect, type RequestEvent } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import { getUserInfo } from "../../api/googleAuth";
import { treaty } from "@elysiajs/eden";
import { type AUTHORIZATION } from "../../../../backend/src/routes/authorization"
import { PUBLIC_RPC_URL, PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_REDIRECT, PUBLIC_CLIENT_SECRET } from "$env/static/public";

export const GET = async (event: RequestEvent) => {

    const { url, cookies} = event
  const code = await url.searchParams.get("code");


  try {
    const oAuth2Client = new OAuth2Client(
      PUBLIC_GOOGLE_CLIENT_ID,
      PUBLIC_CLIENT_SECRET,
      PUBLIC_GOOGLE_REDIRECT
    );
    if (!code) return;

    const response = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(response.tokens);
    const user = oAuth2Client.credentials;

    const userInfoResponse = await getUserInfo(user.access_token);
    if (!userInfoResponse.success) return


    const app = treaty<AUTHORIZATION>(PUBLIC_RPC_URL)

    const responseCheckAdmin = await app.api.admin.login.post(userInfoResponse.data)
    

    if(!responseCheckAdmin.data?.token) {
        console.log(responseCheckAdmin)
        throw redirect(303, "/")
    }
        

    
    const token = responseCheckAdmin.data.token

    cookies.set('session', token, {
      path: "/",
      httpOnly: true, 
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30
    })

    
  } catch (err) {
    console.log("Error logging in with Google", err);
  }
  throw redirect(303, "/dashboard");
};
