"use client"

import { useEffect, useState } from "react"
import { Database, Radio } from "lucide-react"
import { impactHero } from "@/lib/mock-impact-data"

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])
  return value
}

function fmt(n: number) {
  return n.toLocaleString("en-IN")
}

export function ImpactHero() {
  const hours = useCountUp(impactHero.hoursDelivered)
  const people = useCountUp(impactHero.peopleReached)
  const matches = useCountUp(impactHero.matchesCompleted)

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/[0.04] to-transparent">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live · BigQuery stream
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <Database className="h-3 w-3" />
            Impact ledger · v1.3
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <Radio className="h-3 w-3" />
            Updated 12s ago
          </span>
        </div>

        <h1 className="mt-8 max-w-4xl text-balance font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
          Every hour served,
          <span className="italic text-primary"> counted and credited.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          The SevaSetu impact ledger streams every verified match, mobilization,
          and completed hour into BigQuery — surfaced here so citizens, NGOs,
          CSR teams, and judges can see the same truth in real time.
        </p>

        <div className="mt-14 grid gap-px rounded-2xl border border-border bg-border sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-l-2xl bg-card p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Verified hours delivered
            </p>
            <p className="font-serif text-6xl leading-none tracking-tight text-foreground tabular-nums">
              {fmt(hours)}
            </p>
            <p className="text-xs text-muted-foreground">across 14 NGOs in 22 districts</p>
          </div>
          <div className="flex flex-col gap-2 bg-card p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Citizens reached
            </p>
            <p className="font-serif text-6xl leading-none tracking-tight text-foreground tabular-nums">
              {fmt(people)}
            </p>
            <p className="text-xs text-muted-foreground">estimated from NGO reports</p>
          </div>
          <div className="flex flex-col gap-2 rounded-r-2xl bg-card p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Matches completed
            </p>
            <p className="font-serif text-6xl leading-none tracking-tight text-foreground tabular-nums">
              {fmt(matches)}
            </p>
            <p className="text-xs text-muted-foreground">avg match time · 3m 4s</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <MiniStat label="NGOs onboarded" value={impactHero.ngosOnboarded.toString()} />
          <MiniStat label="Districts live" value={impactHero.districtsActive.toString()} />
          <MiniStat label="Languages" value={impactHero.languagesSupported.toString()} />
          <MiniStat label="Disaster drills" value={impactHero.disastersMobilized.toString()} />
        </div>
      </div>
    </section>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-xl border border-border bg-card px-5 py-4">
      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-serif text-3xl leading-none text-foreground">
        {value}
      </span>
    </div>
  )
}
