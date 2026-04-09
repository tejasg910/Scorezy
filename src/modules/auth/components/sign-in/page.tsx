"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // already logged in → redirect
  if (session?.user) {
    const dest = session.user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"
    router.replace(dest)
    return null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const { data, error } = await authClient.signIn.email({ email, password })

    if (error) {
      setError(error.message ?? "Invalid email or password")
      setLoading(false)
      return
    }

    const role = data?.user?.role
    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard")
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0a0a0f] px-4 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[120px] -ml-48 -mb-48" />

      <Card className="w-full max-w-md border-white/5 bg-[#15151e] rounded-none shadow-2xl relative z-10">
        <CardHeader className="space-y-2 pb-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b5cf6]">Authorized Access Only</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <CardTitle className="text-4xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
            Welcome <span className="text-[#8b5cf6]">Back</span>
          </CardTitle>
          <CardDescription className="text-[#a1a1aa] text-base">
            Securely authenticate to your assessment portal
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Credential Identity</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="alex@scorezz.com"
                required
                className="bg-white/5 border-white/5 text-[#f0eeff] focus:border-[#8b5cf6]/50 rounded-none transition-all h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" dir="ltr" className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Security Key</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-white/5 border-white/5 text-[#f0eeff] focus:border-[#8b5cf6]/50 rounded-none transition-all h-12"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-tight">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-6 p-10 pt-8 mt-4">
            <Button type="submit" variant="luxury" className="w-full h-8 text-md" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </Button>
            <div className="flex items-center gap-4 w-full">
              <div className="h-px flex-1 bg-white/5" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">New to Scorezz?</p>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <Link href="/auth/sign-up" className="w-full">
              <Button type="button" variant="outline" className="w-full h-9 rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 transition-all font-heading font-bold uppercase tracking-widest text-xs">
                Initialize Account
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}