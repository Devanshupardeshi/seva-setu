import { Phone, Sparkles } from "lucide-react"
import type { Recommendation } from "@/lib/mock-incident-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const priorityStyle: Record<Recommendation["priority"], string> = {
  critical: "border-destructive/30 bg-destructive/5",
  high: "border-accent/30 bg-accent/5",
  medium: "border-border bg-muted/40",
}

const priorityBadge: Record<Recommendation["priority"], string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-accent/15 text-accent-foreground border-accent/40",
  medium: "bg-muted text-muted-foreground border-border",
}

export function RecommendationsPanel({
  items,
}: {
  items: Recommendation[]
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Gemini recommendations
            </p>
            <p className="text-sm text-foreground">
              Next-best actions · reviewed every 60 s
            </p>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {items.map((r) => (
          <li
            key={r.id}
            className={cn("border-l-2 px-4 py-4", priorityStyle[r.priority])}
            style={{
              borderLeftColor:
                r.priority === "critical"
                  ? "var(--destructive)"
                  : r.priority === "high"
                    ? "var(--accent)"
                    : "var(--border)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                      priorityBadge[r.priority],
                    )}
                  >
                    {r.priority}
                  </span>
                  <h3 className="text-sm font-medium text-foreground">
                    {r.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {r.rationale}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-foreground">
                  <span className="font-medium">Action: </span>
                  {r.action}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {r.contact}
                </p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
                <Phone className="mr-1 h-3.5 w-3.5" />
                Call
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
