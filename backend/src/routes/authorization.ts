import { database } from "../database/setup";
import { Elysia, ValidationError } from "elysia";
import { newAdminSchema, adminInfoSchema, tokenSchema } from "../model";
import { admins } from "../database/schema";
import { eq } from "drizzle-orm";
import { jwt } from "../lib/jwt";

const { sign} = jwt(adminInfoSchema)
const {verify} = jwt(tokenSchema)

export class AuthenticationError extends Error {
  constructor() {
    super()
  }
}

export class AuthorizationError extends Error {
  constructor() {
    super()
  }
}



export const authController = new Elysia()

  .error({
    AuthenticationError,
    AuthorizationError
  })  
  .onError({ as: "global" }, ({ code, set }) => {
    if (code === "AuthenticationError") {
        set.status = 401
        return
    }
    if (code === "AuthorizationError") {
        set.status = 403
        return
    }

  })

  .derive({as: 'global'}, async (ctx) => {
    const authHeader = ctx.headers.authorization;
    if(!authHeader) return {...ctx, admin: null}
    
    const token = authHeader.split('Bearer ')[1]

    const admin = await verify(token)    

    if(!admin)
        return {...ctx, admin: null}


    return {...ctx,  admin}

    
  })

 .post("/api/admin/add", async ({body, admin}) => {
      if (!admin)
        throw new AuthorizationError()

        const adminData = body;


      const checkIfItIsExistResponse = await database.select({email: admins.email}).from(admins).where(eq(admins.email, admin.email))

      if (checkIfItIsExistResponse.length !== 0) {
        return checkIfItIsExistResponse
      }

      const receivedAdmin = await database.insert(admins).values({
        email: adminData.newAdminEmail,
      });

      return receivedAdmin;
    },
    { body: newAdminSchema }
  ) 


  .post("/api/admin/login", async ({ body }) => {
    const adminData = body


    const getAdmin = await database
      .select({
        email: admins.email,
        id: admins.id,
        subId: admins.subId,
        name: admins.name,
      })
      .from(admins)
      .where(eq(admins.email, adminData.email));

    
    if(getAdmin.length === 0)
        throw new AuthenticationError()

    const admin = getAdmin[0]

    if (admin.subId === "") {
        const receivedAdmin = await database.update(admins).set({
            subId: adminData.sub,
            name: adminData.name
        }).where(eq(admins.email, adminData.email)).returning()

        const token = await sign(adminData)
        return {success: true, token}
        
      }
      
      
      
    if ( admin.subId === adminData.sub) {
          const token = await sign(adminData)          
          if(!token)
            return {success: false, msg: "Authentication failed"}

          return {success: true, token}
      
        }        
      throw new AuthenticationError()
  },
  { body: adminInfoSchema }
  );

export type AUTHORIZATION = typeof authController
