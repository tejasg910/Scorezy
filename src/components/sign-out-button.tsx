"use client"

import {   authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SignOutButton() {
  const router = useRouter()

 const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const handleLogout = ()=>{
    setLoggingOut(true);
    console.log("Logging out...")
    authClient.signOut().then(() => {
      router.push("/auth/sign-in")
      console.log("Logged out successfully")
    }).finally(() => {
      setLoggingOut(false);
    })
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout} 
      disabled={loggingOut}
      className="rounded-none border-white/10 text-[#71717a] hover:text-[#f0eeff] hover:bg-white/5 font-heading font-bold uppercase tracking-widest text-[10px] h-9 px-4"
    >
      {loggingOut ? "Locking..." : "Terminate Session"}
    </Button>
  )
}