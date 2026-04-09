"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Tests", href: "/student/tests" },
  { label: "Completed Tests", href: "/student/scores" },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/80 backdrop-blur border-b border-border px-6 pt-4 pb-0 flex gap-6 text-sm font-medium text-muted-foreground sticky top-20 z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-1 pb-4 border-b-2 transition-colors",
              isActive
                ? "border-[#8b5cf6] text-[#f0eeff]"
                : "border-transparent hover:text-foreground hover:border-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
