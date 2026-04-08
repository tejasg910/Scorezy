import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import type { InferSessionAPI } from "better-auth"
import type { Auth } from "@/lib/auth"

export type ServerSession = InferSessionAPI<Auth>

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  })
}