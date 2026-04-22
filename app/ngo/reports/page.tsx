import { ArrowDownToLine, BadgeCheck, Share2 } from "lucide-react"
import { NgoShell } from "@/components/app-shell/ngo-shell"
import { StatCard } from "@/components/ngo/stat-card"
import { Button } from "@/components/ui/button"
import {
  currentCoordinator,
  currentNgo,
  impactRollup,
} from "@/lib/mock-ngo-data"

export default function NgoReportsPage() {
  const maxHours = Math.max(...impactRollup.monthlyHours.map((m) => m.hours))
  const maxSkill = Math.max(...impactRollup.topSkills.map((s) => s.hours))

  return (
    <NgoShell
      ngoName={currentNgo.name}
      darpanId={currentNgo.darpanId}
      coordinatorName={currentCoordinator.name}
    >
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              CSR-ready impact report
            </div>
            <h1 className="mt-1 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {impactRollup.periodLabel}
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Auto-generated from Firestore + BigQuery. Share a cloud-signed PDF
              with funders, or embed the live Looker view on your site.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-1 h-3.5 w-3.5" />
              Share
            </Button>
            <Button size="sm">
              <ArrowDownToLine className="mr-1 h-3.5 w-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 font-serif text-2xl tracking-tight">
                {currentNgo.name}
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                Darpan ID · {currentNgo.darpanId} · Since {currentNgo.since}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Report generated
              </div>
              <div className="font-medium">21 Apr 2026</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Volunteers"
              value={impactRollup.totalVolunteers}
              helper={`${impactRollup.repeatVolunteers} repeat`}
              accent
            />
            <StatCard
              label="Hours given"
              value={impactRollup.totalHours}
              helper="4-month window"
            />
            <StatCard
              label="Sessions"
              value={impactRollup.sessionsDelivered}
              helper="96 completed"
            />
            <StatCard
              label="Children reached"
              value={impactRollup.childrenReached}
              helper="SDG 4 aligned"
            />
            <StatCard
              label="Match fill rate"
              value="92%"
              helper="Ahead of sector avg"
            />
          </div>

          <section className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Monthly volunteer hours
              </div>
              <div className="mt-4 flex items-end gap-3">
                {impactRollup.monthlyHours.map((m) => {
                  const pct = Math.round((m.hours / maxHours) * 100)
                  return (
                    <div
                      key={m.month}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <div className="flex h-40 w-full items-end overflow-hidden rounded-xl bg-secondary">
                        <div
                          className="w-full rounded-xl bg-primary"
                          style={{ height: `${pct}%` }}
                          aria-hidden
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-xl leading-none tracking-tight">
                          {m.hours}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {m.month}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Top skills contributed (hours)
              </div>
              <div className="mt-4 space-y-3">
                {impactRollup.topSkills.map((s) => {
                  const pct = Math.round((s.hours / maxSkill) * 100)
                  return (
                    <div key={s.skill}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm">{s.skill}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {s.hours} h
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              SDG contribution
            </div>
            <div className="mt-4 flex overflow-hidden rounded-2xl">
              {impactRollup.sdgContribution.map((sdg, idx) => (
                <div
                  key={sdg.code}
                  className={`${
                    idx === 0
                      ? "bg-primary text-primary-foreground"
                      : idx === 1
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-foreground"
                  } px-5 py-6`}
                  style={{ flex: sdg.pct }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider opacity-80">
                    {sdg.code}
                  </div>
                  <div className="mt-1 font-serif text-lg leading-tight tracking-tight">
                    {sdg.label}
                  </div>
                  <div className="mt-2 font-mono text-sm">{sdg.pct}%</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </NgoShell>
  )
}
