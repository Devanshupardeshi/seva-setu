"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, LayoutGrid, MapPin, User, Search, LogOut } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { cn } from "@/lib/utils"
import { NotificationListener } from "@/components/volunteer/notification-listener"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const tabs = [
  { href: "/volunteer", label: "Home", icon: Home },
  { href: "/volunteer/matches", label: "Matches", icon: LayoutGrid },
  { href: "/volunteer/profile", label: "Profile", icon: User },
]

export function VolunteerShell({
  children,
  userName,
  userLocation,
}: {
  children: React.ReactNode
  userName: string
  userLocation: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f6f0]">
      {/* Desktop Header */}
      <header className="sticky top-0 z-30 hidden border-b border-border/60 bg-background/90 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <span className="font-serif text-xl leading-none tracking-tight">
                SevaSetu
              </span>
            </Link>
            <span className="ml-2 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Volunteer Hub
            </span>
          </div>

          <nav className="flex items-center gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active =
                pathname === tab.href ||
                (tab.href !== "/volunteer" && pathname.startsWith(tab.href))
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-all",
                    active
                      ? "text-primary scale-105"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="relative rounded-full text-muted-foreground hover:text-foreground">
              <Link href="/volunteer/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right">
                <div className="text-sm font-medium leading-none">{userName}</div>
                <div className="mt-1 flex items-center justify-end gap-1 font-mono text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {userLocation}
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {userName[0]}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Header (Minimal) */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="font-serif text-lg tracking-tight">SevaSetu</span>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" asChild className="relative rounded-full">
            <Link href="/volunteer/notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
            </Link>
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {userName[0]}
          </div>
        </div>
      </div>

      <main className="flex-1 pb-20 md:pb-0">
        <NotificationListener />
        {children}
      </main>

      {/* Mobile Bottom Navigation (App Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border/50 bg-background/95 px-2 pb-safe backdrop-blur-lg md:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active =
            pathname === tab.href ||
            (tab.href !== "/volunteer" && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-1 transition-all",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "rounded-full px-4 py-1 transition-all",
                active && "bg-primary/10"
              )}>
                <Icon className={cn("h-5 w-5", active && "scale-110")} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
