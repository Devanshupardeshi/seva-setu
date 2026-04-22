import { CheckCircle2, Megaphone, Sparkles, UserPlus } from "lucide-react"
import { liveEvents, type LiveEvent } from "@/lib/mock-impact-data"

function iconFor(kind: LiveEvent["kind"]) {
  if (kind === "match") return UserPlus
  if (kind === "complete") return CheckCircle2
  if (kind === "mobilize") return Megaphone
  return Sparkles
}

function tintFor(kind: LiveEvent["kind"]) {
  if (kind === "mobilize") return "bg-accent/15 text-accent"
  if (kind === "milestone") return "bg-accent/15 text-accent"
  return "bg-primary/10 text-primary"
}

export function LiveFeed() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Live activity feed
            </p>
            <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              What&apos;s happening
              <span className="italic text-primary"> right now.</span>
            </h2>
          </div>
          <p className="max-w-md text-pretty text-sm text-muted-foreground">
            A Pub/Sub fanout of every platform event, filtered for public view.
            Personal details are anonymized; impact is not.
          </p>
        </div>

        <ol className="mt-12 flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {liveEvents.map((e) => {
            const Icon = iconFor(e.kind)
            return (
              <li
                key={e.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tintFor(
                    e.kind,
                  )}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    <span className="font-medium">{e.actor}</span>{" "}
                    <span className="text-muted-foreground">{e.detail}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {e.region}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {e.minutesAgo}m ago
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
