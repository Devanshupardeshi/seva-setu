import Link from "next/link"
import { ArrowRight, Clock, MapPin, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { NGO, Need } from "@/lib/types"

const urgencyStyles: Record<Need["urgency"], string> = {
  routine: "bg-muted text-muted-foreground",
  priority: "bg-accent/20 text-accent-foreground",
  critical: "bg-destructive/15 text-destructive",
}

function formatWhen(iso: string, duration: number) {
  const d = new Date(iso)
  const day = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  return `${day} · ${time} · ${duration}h`
}

export function MatchCard({ need, ngo }: { need: Need; ngo: NGO }) {
  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-serif text-sm text-primary">
            {ngo.name[0]}
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{ngo.name}</div>
            <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {need.location.label}
            </div>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            urgencyStyles[need.urgency],
          )}
        >
          {need.urgency}
        </span>
      </div>

      <div>
        <h3 className="text-pretty font-serif text-xl leading-snug tracking-tight">
          {need.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {need.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {need.skillsRequired?.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatWhen(need.startTime, need.durationHours)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {need.filled}/{need.slots} filled
        </span>
      </div>

      <div className="-mx-5 -mb-5 mt-1 flex items-center justify-between gap-3 rounded-b-2xl border-t border-border bg-secondary/50 px-5 py-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Match score · {need.matchScore}
            </div>
            <div className="mt-0.5 line-clamp-1 text-xs text-foreground">
              {need.matchReason}
            </div>
          </div>
        </div>
        <Button asChild size="sm" variant="ghost" className="shrink-0">
          <Link href={`/volunteer/matches/${need.id}`}>
            View
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
