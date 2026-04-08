"use client"

import {   authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  )
}