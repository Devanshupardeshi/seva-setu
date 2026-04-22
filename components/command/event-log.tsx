"use client"

import {
  AlertOctagon,
  CheckCircle2,
  FileText,
  Megaphone,
  Send,
  UserCheck,
} from "lucide-react"
import type { IncidentEvent } from "@/lib/mock-incident-data"
import { cn } from "@/lib/utils"

const kindIcon: Record<IncidentEvent["kind"], React.ComponentType<{ className?: string }>> = {
  alert: AlertOctagon,
  mobilize: Megaphone,
  accept: UserCheck,
  arrive: CheckCircle2,
  dispatch: Send,
  report: FileText,
}

const kindColor: Record<IncidentEvent["kind"], string> = {
  alert: "text-destructive bg-destructive/10 border-destructive/30",
  mobilize: "text-accent bg-accent/15 border-accent/30",
  accept: "text-primary bg-primary/10 border-primary/30",
  arrive: "text-primary bg-primary/10 border-primary/30",
  dispatch: "text-foreground bg-muted border-border",
  report: "text-muted-foreground bg-muted border-border",
}

export function EventLog({ events }: { events: IncidentEvent[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Live event log
          </p>
          <p className="text-sm text-foreground">Pub/Sub stream · last 5 min</p>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-primary/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      </div>

      <ol className="max-h-[26rem] overflow-y-auto">
        {events
          .slice()
          .reverse()
          .map((e) => {
            const Icon = kindIcon[e.kind]
            return (
              <li
                key={e.id}
                className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-b-0"
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                    kindColor[e.kind],
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm text-foreground">
                      {e.title}
                    </p>
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      T+{e.t}
                    </span>
                  </div>
                  {e.sub && (
                    <p className="text-xs text-muted-foreground">{e.sub}</p>
                  )}
                </div>
              </li>
            )
          })}
      </ol>
    </div>
  )
}
