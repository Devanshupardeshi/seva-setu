"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroMap } from "./hero-map"
import { useEffect, useState } from "react"

export function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const cookies = document.cookie.split('; ')
    const hasSession = cookies.some(c => c.startsWith('session='))
    const roleCookie = cookies.find(c => c.startsWith('role='))?.split('=')[1]
    
    setIsLoggedIn(hasSession)
    setRole(roleCookie || null)
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-12 md:px-6 md:pb-24 md:pt-20">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Google Solution Challenge 2026 — Smart Resource Allocation
          </div>

          <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
            When every minute matters,
            <span className="block italic text-primary">
              coordination shouldn&apos;t take hours.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            SevaSetu is an AI-powered bridge between India&apos;s 33 lakh NGOs
            and the millions who want to help. Voice-onboarded in any language.
            Matched in seconds. Mobilized in minutes during a crisis.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isLoggedIn ? (
              <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                <Link href={role === 'volunteer' ? '/volunteer' : '/ngo'}>
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Go to {role === 'volunteer' ? 'Volunteer Dashboard' : 'NGO Console'}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <Link href="/volunteer/onboarding">
                    I want to help
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                >
                  <Link href="/login">Volunteer Login</Link>
                </Button>
              </>
            )}
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Languages
              </dt>
              <dd className="mt-1 font-serif text-3xl text-foreground">5+</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Match time
              </dt>
              <dd className="mt-1 font-serif text-3xl text-foreground">
                &lt;5m
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Mobilize 50
              </dt>
              <dd className="mt-1 font-serif text-3xl text-foreground">
                &lt;10m
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-5">
          <HeroMap />
        </div>
      </div>
    </section>
  )
}
