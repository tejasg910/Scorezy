"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { SignOutButton } from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-extrabold tracking-tighter text-[#f0eeff]">
            score<span className="text-[#b18aff]">zy</span>
          </span>
        </Link>

        {/* Navigation Links - Only on Home */}
        {isHome && (
          <nav className="hidden lg:flex items-center gap-10">
            {["How it works", "Features", "For you", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717a] transition-all hover:text-[#f0eeff] hover:tracking-[0.25em]"
              >
                {item}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          {(!isPending && !session) ? (
            <>
              <Link href="/auth/sign-in" className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] hover:text-[#f0eeff] transition-colors">
                Personal Access
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  variant="luxury"
                  className="h-11 px-6 text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  Initialize Identity
                </Button>
              </Link>
            </>
          ) : session && (
            <div className="flex items-center gap-6">
              <Link
                href={session.user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
                className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
              >
                Access {session.user.role === "teacher" ? "Teacher" : "Student"} Vault
              </Link>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}