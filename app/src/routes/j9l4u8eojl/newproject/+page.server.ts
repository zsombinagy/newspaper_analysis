import { redirect} from "@sveltejs/kit"
import type { RequestEvent } from "../../oauth/$types"

export const load = async (event: RequestEvent) =>  {
    const {cookies} = event
    const session = cookies.get("session")
    
    if (!session) {
        
        throw redirect(302, '/j9l4u8eojl')

    } 

}
