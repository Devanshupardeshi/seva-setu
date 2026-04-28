import Link from "next/link"
import { ArrowRight, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Need } from "@/lib/types"

function formatWhen(iso: string) {
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
  return `${day} · ${time}`
}

const urgencyStyles: Record<Need["urgency"], string> = {
  routine: "bg-muted text-muted-foreground",
  priority: "bg-accent/20 text-accent-foreground",
  critical: "bg-destructive/15 text-destructive",
}

export function NeedRow({
  need,
  applicants,
}: {
  need: Need
  applicants: number
}) {
  const fillPct = Math.round((need.filled / Math.max(1, need.slots)) * 100)
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-lg leading-tight tracking-tight">
            {need.title}
          </h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
              urgencyStyles[need.urgency],
            )}
          >
            {need.urgency}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {need.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatWhen(need.startTime)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {need.location.label}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {need.filled}/{need.slots} slots
          </span>
        </div>
      </div>

      <div className="flex items-center gap-5 md:pl-5">
        <div className="hidden w-32 md:block">
          <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Filled</span>
            <span>{fillPct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-2xl tracking-tight">{applicants}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            applicants
          </div>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href={`/ngo/needs/${need.id}`}>
            Review
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
