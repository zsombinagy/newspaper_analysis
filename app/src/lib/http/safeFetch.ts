import { z } from "zod";

type Response<Type> =
  | {
      success: true;
      status: number;
      data: Type;
    }
  | {
      success: false;
      status: number | null;
    };

type Methods = "GET" | "POST" | "PATCH" | "DELETE";

export const safeFetch = async <Schema extends z.ZodTypeAny>(config: {
  method: Methods;
  url: string;
  schema: Schema;
  payload?: any;
  authToken?: string
}): Promise<Response<z.infer<typeof schema>>> => {
  const { method, url, schema, payload, authToken } = config;
  try {

    const headers: HeadersInit = {
        ...(payload && {"Content-Type": "application/JSON"}),
        ...(authToken && {'Authorization': `Bearer ${authToken}`} )
    }

    const response = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    console.log(response)
    if (response.status >= 500) 
      return { success: false, status: response.status };
  
      

    if (response.status >= 400) {
        const errorResponse = await response.json();
        console.error("Client error:", errorResponse, errorResponse.expected.error.schema, errorResponse.errors[0].schema);
        return { success: false, status: response.status };
    }
      
    
    const data = await response.json();
    const result = schema.safeParse(data);

    if (!result.success) return { success: false, status: response.status };
    return { data: result.data, success: true, status: response.status };
  } catch (error) {
    return { success: false, status: null };
  }
};