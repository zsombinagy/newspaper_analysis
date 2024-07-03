
import {  redirect, type RequestEvent } from "@sveltejs/kit";
import { OAuth2Client } from "google-auth-library";
import { getUserInfo } from "../../api/googleAuth";
import { treaty } from "@elysiajs/eden";
import { type AUTHORIZATION } from "../../../../backend/src/routes/authorization"
import { PUBLIC_RPC_URL, PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_REDIRECT, PUBLIC_CLIENT_SECRET } from "$env/static/public";
import { error } from '@sveltejs/kit';
import type { AdminInfoType } from "../../stores/stores";




export const GET = async (event: RequestEvent) => {
  
  const { url, cookies} = event
  const code = await url.searchParams.get("code");

  let adminData: AdminInfoType

  try {
    const oAuth2Client = new OAuth2Client(
      PUBLIC_GOOGLE_CLIENT_ID,
      PUBLIC_CLIENT_SECRET,
      PUBLIC_GOOGLE_REDIRECT
    );
    if (!code) 
      throw error(400, "Bad Request: Missing authorization code")

    const response = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(response.tokens);
    const user = oAuth2Client.credentials;
  

    const adminInfoResponse = await getUserInfo(user.access_token);
    if (!adminInfoResponse.success)   
        throw error(403,"Forbidden: Failed to fetch user info" )
     

    const app = treaty<AUTHORIZATION>(PUBLIC_RPC_URL)



    const responseCheckAdmin = await app.api.admin.login.post(adminInfoResponse.data)
    

    if(!responseCheckAdmin.data?.token) 
      throw error(403, "Forbidden: Admin is not authorized to access this resource")     
    
    
    const token = responseCheckAdmin.data.token    

    adminData = adminInfoResponse.data

    cookies.set('session', token, {
      path: "/",
      httpOnly: true, 
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30
    })
    
    
    
  } catch (err) {
    console.log(err)
    throw error(500, "Internal Server Error")
  }
  const name = encodeURIComponent(adminData.name);
  const email = encodeURIComponent(adminData.email); 

  throw redirect(303, `/set-local-storage?name=${name}&email=${email}`)
};
