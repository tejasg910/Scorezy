"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@/components/sign-out-button"
import { useSession } from "@/lib/auth-client"
import { motion } from "framer-motion"

export function Header() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  console.log(session, "This is session")
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
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
                className="text-sm font-medium tracking-wide text-[#a1a1aa] transition-colors hover:text-[#f0eeff]"
              >
                {item}
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {(!isPending && !session) ? (
            <>
              <Link href="/auth/sign-in" className="text-sm font-semibold text-[#a1a1aa] hover:text-[#f0eeff] transition-colors">
                Sign In
              </Link>
              <Link href="/auth/sign-up">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#8b5cf6] hover:bg-[#a78bfa] text-white px-5 py-2.5 font-heading text-sm font-bold tracking-wider transition-all"
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  Get Started Free
                </motion.button>
              </Link>
            </>
          ) : session && (
            <div className="flex items-center gap-4">
              <Link
                href={session.user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard"}
                className="text-sm font-semibold text-[#a1a1aa] hover:text-[#f0eeff] transition-colors"
              >
                {session.user.role === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}
              </Link>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}