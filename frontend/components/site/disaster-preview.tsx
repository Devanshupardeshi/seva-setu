import Link from "next/link"
import { ArrowRight, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PreviewMap } from "@/components/site/preview-map"

const timelineEvents = [
  { t: "00:00", label: "Incident created", sub: "District Collector · Dhemaji" },
  { t: "00:04", label: "12,480 volunteers queried", sub: "Vector Search · skill-ranked" },
  { t: "00:12", label: "Push notifications fanned out", sub: "Firebase Cloud Messaging" },
  { t: "00:28", label: "First 50 accepted", sub: "Skill gap: boat operators −8" },
  { t: "00:47", label: "342 mobilized", sub: "12 doctors en route" },
]

const skillGap = [
  { skill: "First aid", have: 124, need: 100, color: "bg-primary" },
  { skill: "Boat operators", have: 22, need: 30, color: "bg-accent" },
  { skill: "Translators (Assamese)", have: 18, need: 15, color: "bg-primary" },
  { skill: "Doctors", have: 12, need: 20, color: "bg-accent" },
]

export function DisasterPreview() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent-foreground">
              <Radio className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono uppercase tracking-widest">
                Disaster Command Center
              </span>
            </div>
            <h2 className="mt-5 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              The dashboard every
              <span className="italic text-primary">
                {" "}District Collector
              </span>{" "}
              wished they had.
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              One click activates a geofenced incident. Within a minute,
              thousands of skill-matched volunteers are contacted, routed, and
              assigned. The dashboard shows exactly who is en route, what
              skills are still missing, and where the gaps are.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-foreground">
                  <span className="font-medium">Live map</span> of responders
                  with role-coded pins and ETA.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-foreground">
                  <span className="font-medium">Skill-gap analysis</span> that
                  refreshes every 30 seconds.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-foreground">
                  <span className="font-medium">Auto-generated reports</span>{" "}
                  for NDRF, CSR funders, and state government.
                </span>
              </li>
            </ul>

            <Button asChild size="lg" className="mt-8">
              <Link href="/command-center">
                Enter the command center
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="md:col-span-7 flex flex-col gap-6">
            <PreviewMap />
            
            <div className="rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Incident
                  </p>
                  <p className="font-serif text-xl text-foreground">
                    Dhemaji Flood Drill
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-accent/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {/* Timeline */}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Timeline
                  </p>
                  <ol className="mt-3 space-y-3">
                    {timelineEvents.map((e, i) => (
                      <li key={e.t} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card font-mono text-[10px] text-muted-foreground">
                            {i + 1}
                          </span>
                          {i < timelineEvents.length - 1 && (
                            <span className="mt-1 h-6 w-px bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm text-foreground">{e.label}</p>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {e.t}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {e.sub}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Skill gap */}
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Skill-gap analysis
                  </p>
                  <ul className="mt-3 space-y-4">
                    {skillGap.map((s) => {
                      const pct = Math.min(100, (s.have / s.need) * 100)
                      const met = s.have >= s.need
                      return (
                        <li key={s.skill}>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm text-foreground">
                              {s.skill}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {s.have}/{s.need}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${met ? "bg-primary" : "bg-accent"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Gap alert:{" "}
                    </span>
                    still need 8 boat operators in Sector 4 and 8 more doctors.
                    Recommending outbound call to partner medical college.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
