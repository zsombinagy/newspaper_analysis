import  { writable } from "svelte/store"
import type { z } from "zod"
import type { adminInfoSchema } from "../modell"

export type AdminInfoType = z.infer<typeof adminInfoSchema>

export const isLoggedIn = writable(false)

export const adminInfo = writable<AdminInfoType>(null)