import { AlertTriangle, CheckCircle2, CircleDotDashed, Users } from "lucide-react"
import type { Sector } from "@/lib/mock-incident-data"
import { cn } from "@/lib/utils"

const statusMeta: Record<
  Sector["status"],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bar: string }
> = {
  secured: {
    label: "Secured",
    icon: CheckCircle2,
    color: "text-primary",
    bar: "bg-primary",
  },
  partial: {
    label: "Partial",
    icon: CircleDotDashed,
    color: "text-accent",
    bar: "bg-accent",
  },
  unreached: {
    label: "Unreached",
    icon: AlertTriangle,
    color: "text-destructive",
    bar: "bg-destructive",
  },
}

export function SectorGrid({ sectors }: { sectors: Sector[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Sector status
          </p>
          <p className="text-sm text-foreground">
            Coverage by sub-district · population-weighted
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        {sectors.map((s) => {
          const Meta = statusMeta[s.status]
          const Icon = Meta.icon
          const pct = Math.min(100, (s.onSite / s.needed) * 100)
          return (
            <div key={s.id} className="bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    pop. {s.population.toLocaleString("en-IN")}
                  </p>
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest",
                    Meta.color,
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {Meta.label}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    on-site
                  </span>
                  <span className="font-mono text-xs tabular-nums text-foreground">
                    {s.onSite}/{s.needed}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", Meta.bar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {s.note}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
