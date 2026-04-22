import { AlertTriangle, CheckCircle2 } from "lucide-react"
import type { Incident } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SkillGapPanel({
  skillsNeeded,
}: {
  skillsNeeded: Incident["skillsNeeded"]
}) {
  const gaps = skillsNeeded.filter((s) => s.filled < s.needed)
  const totalGap = gaps.reduce((acc, s) => acc + (s.needed - s.filled), 0)

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Skill-gap analysis
          </p>
          <p className="text-sm text-foreground">
            Auto-refresh every 30 s · Vertex AI
          </p>
        </div>
        <div
          className={cn(
            "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest",
            totalGap > 0
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-primary/30 bg-primary/10 text-primary",
          )}
        >
          {totalGap > 0 ? `Gap · ${totalGap}` : "All covered"}
        </div>
      </div>

      <ul className="divide-y divide-border">
        {skillsNeeded.map((s) => {
          const pct = Math.min(100, (s.filled / s.needed) * 100)
          const met = s.filled >= s.needed
          const delta = s.needed - s.filled
          return (
            <li key={s.skill} className="px-4 py-3">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  {met ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-accent" />
                  )}
                  <span className="text-sm text-foreground">{s.skill}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {s.filled}
                    <span className="text-muted-foreground">/{s.needed}</span>
                  </span>
                  {!met && (
                    <span className="font-mono text-[11px] text-accent">
                      −{delta}
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    met ? "bg-primary" : "bg-accent",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      {totalGap > 0 && (
        <div className="m-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-3 text-xs leading-relaxed">
          <p className="font-medium text-destructive">
            {totalGap} role-slots still open.
          </p>
          <p className="mt-1 text-muted-foreground">
            System is expanding the search radius and escalating to partner
            institutions automatically.
          </p>
        </div>
      )}
    </div>
  )
}
