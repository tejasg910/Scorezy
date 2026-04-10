"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { SignOutButton } from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
            score<span className="text-[#b18aff]">zz</span>
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {(!isPending && !session) ? (
            <>
              <Link href="/auth/sign-in" className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] hover:text-[#f0eeff] transition-colors">
                Personal Access
              </Link>
              <Link href="/auth/sign-up">
                <Button
                  variant="luxury"
                  className="h-8 px-6 text-[10px] font-bold tracking-[0.2em] uppercase"
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

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger >
              <Button variant="ghost" size="icon" className="text-[#a1a1aa] hover:text-[#f0eeff] p-0 h-auto">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0a0a0f] border-white/5 pt-16 flex flex-col gap-8 w-[280px]">
              {isHome && (
                <nav className="flex flex-col gap-6 pb-6 border-b border-white/5">
                  {["How it works", "Features", "For you", "Pricing"].map((item) => (
                    <Link
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717a] hover:text-[#f0eeff]"
                    >
                      {item}
                    </Link>
                  ))}
                </nav>
              )}
              
              <div className="flex flex-col gap-6">
                {(!isPending && !session) ? (
                  <>
                    <Link href="/auth/sign-in" className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] hover:text-[#f0eeff]">
                      Personal Access
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        variant="luxury"
                        className="w-full h-10 text-[10px] font-bold tracking-[0.2em] uppercase"
                      >
                        Initialize Identity
                      </Button>
                    </Link>
                  </>
                ) : session && (
                  <>
                    <Link
                      href={session.user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#b18aff] hover:text-[#d8b4fe]"
                    >
                      Access {session.user.role === "teacher" ? "Teacher" : "Student"} Vault
                    </Link>
                    <div className="pt-4 border-t border-white/5">
                      <SignOutButton />
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}