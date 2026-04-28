"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  FileBarChart,
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  Calendar,
} from "lucide-react"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"

const tabs = [
  { href: "/corporate", label: "Boardroom", icon: LayoutDashboard },
  { href: "/corporate/employees", label: "Employees", icon: Users },
  { href: "/corporate/events", label: "Team Days", icon: Calendar },
  { href: "/corporate/reports", label: "CSR Compliance", icon: FileBarChart },
]

export function CorporateShell({
  children,
  companyName,
  employeesCount,
  userName,
}: {
  children: React.ReactNode
  companyName: string
  employeesCount: number
  userName: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const { signOut } = await import("@/frontend/lib/auth/client")
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-serif text-xl leading-none tracking-tight">
                SevaSetu
              </span>
            </Link>
            <span className="ml-2 hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:inline-block">
              Corporate Portal
            </span>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active =
                pathname === tab.href ||
                (tab.href !== "/corporate" && pathname.startsWith(tab.href))
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-1.5 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle className="hidden sm:inline-flex" />
            <ModeToggle compact className="sm:hidden" />
            <div className="hidden text-right sm:block">
              <div className="flex items-center justify-end gap-1 text-sm leading-tight">
                {companyName}
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {employeesCount.toLocaleString()} employees
              </div>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary"
              title={userName}
            >
              <Building2 className="h-4 w-4" />
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
