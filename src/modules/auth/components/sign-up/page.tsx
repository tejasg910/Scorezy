"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"teacher" | "student">("student")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = e.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,               // our custom field
      callbackURL: role === "teacher" ? "/teacher/dashboard" : "/student/dashboard",
    })

    if (error) {
      setError(error.message ?? "Something went wrong")
      setLoading(false)
      return
    }

    router.push(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join as a teacher or student</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-4">

            {/* Role toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
              {(["student", "teacher"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    role === r
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Alex Johnson" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="alex@school.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-primary underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}