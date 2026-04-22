"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

const links = [
  { href: "/volunteer", label: "For volunteers" },
  { href: "/ngo", label: "For NGOs" },
  { href: "/command-center", label: "Command center" },
  { href: "/impact", label: "Impact" },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="SevaSetu home">
          <Logo className="h-8 w-8" />
          <span className="font-serif text-2xl leading-none tracking-tight">
            SevaSetu
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">NGO login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/volunteer/onboarding">I want to help</Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                NGO login
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href="/volunteer" onClick={() => setOpen(false)}>
                I want to help
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
