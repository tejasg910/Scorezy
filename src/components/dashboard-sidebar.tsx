"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  CreditCard,
  ChevronLeft, 
  ChevronRight,
  GraduationCap
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Class Rooms",
    href: "/teacher/dashboard", // Currently pointing to the same place as classrooms are the dashboard
    icon: Users,
  },
  {
    title: "Billing",
    href: "/teacher/billing",
    icon: CreditCard,
  },
]

type DashboardSidebarProps = {
  /** Server-rendered usage widget injected from the layout */
  usageWidget?: React.ReactNode
}

export function DashboardSidebar({ usageWidget }: DashboardSidebarProps = {}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* --- Desktop Sidebar --- */}
      <aside 
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 z-40 h-screen border-r border-white/5 bg-[#0a0a0f] transition-all duration-300 ease-in-out pt-24",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full px-4 pb-4">
          <div className="flex-1 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-sm transition-all group relative",
                    isActive 
                      ? "bg-[#8b5cf6]/10 text-[#b18aff]" 
                      : "text-[#a1a1aa] hover:bg-white/5 hover:text-[#f0eeff]"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#b18aff]" : "group-hover:text-[#f0eeff]")} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium tracking-wide">
                      {item.title}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8b5cf6] rounded-r-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Usage widget slot — only visible when sidebar is expanded */}
          {usageWidget && !isCollapsed && (
            <div className="mb-2">
              {usageWidget}
            </div>
          )}

          <div className="pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full justify-center text-[#71717a] hover:text-[#f0eeff] hover:bg-white/5"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* --- Mobile Bottom Navigation --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-white/5 bg-[#0a0a0f]/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16 px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.title} 
                href={item.href} 
                className="flex flex-col items-center justify-center gap-1.5 w-full h-full text-[#a1a1aa] hover:text-[#f0eeff] transition-colors"
              >
                <div className={cn(
                  "p-1.5 rounded-full",
                  isActive ? "bg-[#8b5cf6]/20 text-[#b18aff]" : ""
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest", 
                  isActive ? "text-[#b18aff]" : ""
                )}>
                  {item.title}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
