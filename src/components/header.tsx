"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"
import { useSession } from "@/lib/auth-client"


interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Quizzes", href: "/quizzes" },
  { label: "Leaderboard", href: "/leaderboard" },
]

export function Header() {
  const pathname = usePathname();

  const {data, isPending} = useSession()
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">QuizApp</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {!isPending && !data && (<>
       
            <Link href="/auth/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/sign-up" className="hidden md:block">
            <Button size="sm">Sign Up</Button>
          </Link>   </>)}
          {data && <SignOutButton />}
        </div>
      </div>
    </header>
  )
}