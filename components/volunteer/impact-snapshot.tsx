import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Volunteer } from "@/lib/types"

export function ImpactSnapshot({ volunteer }: { volunteer: Volunteer }) {
  const stats = [
    { label: "Hours given", value: volunteer.hoursGiven },
    { label: "People helped", value: volunteer.peopleHelped },
    { label: "Projects", value: volunteer.projectsCompleted },
    { label: "Trust score", value: volunteer.trustScore.toFixed(1) },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Lifetime impact
        </div>
        <Link
          href="/volunteer/profile"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Details
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-serif text-3xl leading-none tracking-tight">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
