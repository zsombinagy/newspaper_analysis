import  { writable } from "svelte/store"
import type { z } from "zod"
import type { adminInfoSchema } from "../modell"

export type AdminInfoType = z.infer<typeof adminInfoSchema> | null

export const isLoggedIn = writable(false)


