"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  BadgeCheck,
  FileBarChart,
  LayoutDashboard,
  ListTree,
  Plus,
} from "lucide-react"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/ngo", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ngo/needs", label: "Needs", icon: ListTree },
  { href: "/ngo/reports", label: "Reports", icon: FileBarChart },
]

export function NgoShell({
  children,
  ngoName,
  darpanId,
  coordinatorName,
}: {
  children: React.ReactNode
  ngoName: string
  darpanId: string
  coordinatorName: string
}) {
  const pathname = usePathname()

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
              NGO console
            </span>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active =
                pathname === tab.href ||
                (tab.href !== "/ngo" && pathname.startsWith(tab.href))
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
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/ngo/post">
                <Plus className="mr-1 h-4 w-4" />
                Post a need
              </Link>
            </Button>
            <div className="hidden text-right sm:block">
              <div className="flex items-center justify-end gap-1 text-sm leading-tight">
                {ngoName}
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {darpanId}
              </div>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
              title={coordinatorName}
            >
              {coordinatorName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-border/50 px-4 py-2 md:hidden">
          <div className="flex items-center gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active =
                pathname === tab.href ||
                (tab.href !== "/ngo" && pathname.startsWith(tab.href))
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-1.5 text-xs",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </div>
          <Link
            href="/ngo/post"
            className="flex items-center gap-1 font-mono text-[11px] text-primary"
          >
            Post
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
