"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertOctagon,
  FileBarChart,
  LayoutGrid,
  Plus,
  Radio,
  ShieldAlert,
} from "lucide-react"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

const tabs = [
  { href: "/command-center", label: "Live incident", icon: Radio },
  { href: "/command-center#sectors", label: "Sectors", icon: LayoutGrid },
  { href: "/command-center/reports", label: "Reports", icon: FileBarChart },
]

export function CommandShell({
  children,
  operatorName,
  operatorRole,
  office,
  incidentTitle,
  severity,
  activeSince,
}: {
  children: React.ReactNode
  operatorName: string
  operatorRole: string
  office: string
  incidentTitle: string
  severity: "low" | "medium" | "high" | "critical"
  activeSince: string
}) {
  const pathname = usePathname()
  const severityTone: "yellow" | "orange" | "red" =
    severity === "critical" ? "red" : severity === "high" ? "orange" : "yellow"
  const severityLabel =
    severity === "critical" ? "RED" : severity === "high" ? "ORANGE" : severity === "medium" ? "YELLOW" : "LOW"
  const severityColor = {
    yellow: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
    orange: "bg-accent/15 text-accent-foreground border-accent/40",
    red: "bg-destructive/15 text-destructive border-destructive/40",
  }[severityTone]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Severity alert strip */}
      <div
        className={cn(
          "border-b px-4 py-2 text-center text-xs md:text-sm",
          severityTone === "red"
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : severityTone === "orange"
              ? "border-accent/30 bg-accent/10 text-accent-foreground"
              : "border-yellow-500/30 bg-yellow-500/10",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 font-mono uppercase tracking-widest">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Active {severityLabel} alert · {incidentTitle}</span>
          <span className="opacity-60">· activated {activeSince}</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-serif text-xl leading-none tracking-tight">
                SevaSetu
              </span>
            </Link>
            <span
              className={cn(
                "ml-2 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                severityColor,
              )}
            >
              Command center
            </span>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active =
                pathname === tab.href ||
                (tab.href !== "/command-center" &&
                  pathname.startsWith(tab.href))
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
            <Button asChild size="sm" variant="destructive" className="hidden md:inline-flex">
              <Link href="/command-center/new">
                <Plus className="mr-1 h-4 w-4" />
                New incident
              </Link>
            </Button>
            <div className="hidden text-right sm:block">
              <div className="flex items-center justify-end gap-1 text-sm leading-tight">
                {operatorName}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {operatorRole} · {office}
              </div>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
              title={operatorName}
            >
              {operatorName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between border-t border-border/50 px-4 py-2 md:hidden">
          <div className="flex items-center gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active =
                pathname === tab.href ||
                (tab.href !== "/command-center" &&
                  pathname.startsWith(tab.href))
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
            href="/command-center/new"
            className="flex items-center gap-1 font-mono text-[11px] text-destructive"
          >
            <AlertOctagon className="h-3 w-3" />
            New
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
