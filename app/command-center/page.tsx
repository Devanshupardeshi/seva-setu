"use client"

import Link from "next/link"
import { Clock, FileDown, FlaskConical, Share2 } from "lucide-react"
import { CommandShell } from "@/components/app-shell/command-shell"
import { LiveMap } from "@/components/command/live-map"
import { SkillGapPanel } from "@/components/command/skill-gap-panel"
import { StatStrip } from "@/components/command/stat-strip"
import { EventLog } from "@/components/command/event-log"
import { ResponderList } from "@/components/command/responder-list"
import { SectorGrid } from "@/components/command/sector-grid"
import { RecommendationsPanel } from "@/components/command/recommendations"
import { MobilizationPanel } from "@/components/command/mobilization-panel"
import { Button } from "@/components/ui/button"
import { activeIncident as mockIncident } from "@/lib/mock-data"
import {
  incidentEvents,
  incidentOperator,
  pastDrills,
  recommendations,
  responders,
  sectors,
} from "@/lib/mock-incident-data"
import { useDocument } from "@/hooks/use-firestore"
import { Incident } from "@/lib/types"

function formatActivatedAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.max(4, Math.round(ms / 60000))
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  return `${hrs}h ${rem}m ago`
}

export default function CommandCenterPage() {
  // Subscribe to real-time incident data
  const { data: liveIncident } = useDocument<Incident>("incidents", "inc_dhemaji", mockIncident)
  
  const inc = liveIncident || mockIncident
  const sectorsSecured = sectors.filter((s) => s.status === "secured").length
  const totalSkillsNeeded = inc.skillsNeeded.reduce((a, s) => a + s.needed, 0)
  const totalSkillsFilled = inc.skillsNeeded.reduce((a, s) => a + s.filled, 0)
  const coverage = Math.round((totalSkillsFilled / totalSkillsNeeded) * 100)
  const activeSince = formatActivatedAgo(inc.activatedAt)

  return (
    <CommandShell
      operatorName={incidentOperator.name}
      operatorRole={incidentOperator.role}
      office={incidentOperator.office}
      incidentTitle={inc.title}
      severity={inc.severity}
      activeSince={activeSince}
    >
      {/* Incident identity + quick actions */}
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Active incident · T+{activeSince}
            </p>
            <h1 className="mt-1 text-balance font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
              {inc.title}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{inc.epicenter.label}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Activated by {incidentOperator.activatedBy}
              </span>
              <span>
                Coverage{" "}
                <span className="font-mono tabular-nums text-foreground">
                  {coverage}%
                </span>
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `SITREP: ${inc.title}`,
                    text: `Active incident coverage at ${coverage}%. epicenter: ${inc.epicenter.label}`,
                    url: window.location.href,
                  }).catch(() => {})
                } else {
                  alert("SITREP link copied to clipboard!")
                }
              }}
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share SITREP
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent"
              onClick={() => window.print()}
            >
              <FileDown className="mr-1 h-4 w-4" />
              Export PDF
            </Button>
            <Button asChild variant="destructive" size="sm">
              <Link href="/command-center/new">
                <FlaskConical className="mr-1 h-4 w-4" />
                Start another
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        {/* Stat strip */}
        <StatStrip
          committed={inc.respondersCommitted}
          enRoute={inc.respondersEnRoute}
          onSite={inc.respondersOnSite}
          sectorsSecured={sectorsSecured}
          totalSectors={sectors.length}
        />

        {/* Map + Skill gap */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12" id="sectors">
          <div className="lg:col-span-8">
            <LiveMap
              responders={responders}
              sectors={sectors}
              epicenterLabel={inc.epicenter.label}
              radiusKm={inc.radiusKm}
            />
          </div>
          <div className="lg:col-span-4">
            <SkillGapPanel skillsNeeded={inc.skillsNeeded} />
          </div>
        </div>

        {/* Sectors + Event log */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectorGrid sectors={sectors} />
          </div>
          <div className="lg:col-span-5">
            <EventLog events={incidentEvents} />
          </div>
        </div>

        {/* Recommendations + Mobilization */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RecommendationsPanel items={recommendations} />
          </div>
          <div className="lg:col-span-5">
            <MobilizationPanel incidentId={inc.id} />
          </div>
        </div>

        {/* Responder list */}
        <div className="mt-6">
          <ResponderList responders={responders} />
        </div>

        {/* Track record */}
        <section className="mt-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Track record
              </p>
              <p className="text-sm text-foreground">
                Past drills across pilot cities
              </p>
            </div>
            <Link
              href="/command-center/reports"
              className="font-mono text-[11px] uppercase tracking-widest text-primary"
            >
              All reports
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
            {pastDrills.map((d) => (
              <div key={d.id} className="bg-card p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {d.date} · {d.type}
                </p>
                <p className="mt-1 text-sm text-foreground">{d.location}</p>
                <div className="mt-3 flex items-baseline gap-4">
                  <div>
                    <p className="font-serif text-2xl tabular-nums text-foreground">
                      {d.mobilized}
                    </p>
                    <p className="text-xs text-muted-foreground">mobilized</p>
                  </div>
                  <div>
                    <p className="font-serif text-2xl tabular-nums text-foreground">
                      {d.mobilizeMin}
                      <span className="text-base">m</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      time-to-fan-out
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CommandShell>
  )
}
