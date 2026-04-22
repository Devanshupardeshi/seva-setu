"use client"

import {
  Activity,
  ArrowRight,
  Download,
  Filter,
  Globe,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { CorporateShell } from "@/components/app-shell/corporate-shell"
import { StatCard } from "@/components/ngo/stat-card"
import { Button } from "@/components/ui/button"
import {
  companyNeeds,
  corporateStats,
  currentCorporate,
  teamEvents,
} from "@/lib/mock-corporate-data"
import Link from "next/link"

export default function CorporateDashboardPage() {
  return (
    <CorporateShell
      companyName={currentCorporate.company}
      employeesCount={currentCorporate.employeesCount}
      userName={currentCorporate.name}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              CSR Boardroom
            </div>
            <h1 className="mt-1 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              Infosys reached 1.2M impact hours this quarter.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Your company-wide matching portal is active. AI is currently matching 14,000+ employees to high-impact NGO projects.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Board Report
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Book Team Day
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {corporateStats.map((stat, i) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              helper={stat.trend}
              accent={i === 0}
            />
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Active Company Needs */}
          <div className="lg:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl tracking-tight">Active Company Needs</h2>
              <Link href="/corporate/employees" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="grid gap-4">
              {companyNeeds.map((need) => (
                <div key={need.id} className="rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl tracking-tight">{need.title}</h3>
                      <p className="text-sm text-muted-foreground">Partner: {need.partnerNgo}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
                        {need.status}
                      </span>
                      <p className="mt-1 text-[10px] text-muted-foreground">Deadline: {need.deadline}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Employee enrollment</span>
                      <span className="font-mono">{need.employeesJoined} / {need.employeesRequested}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${(need.employeesJoined / need.employeesRequested) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Building Events */}
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl tracking-tight">Team Gigs</h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Department-level</span>
            </div>
            <div className="grid gap-3">
              {teamEvents.map((event) => (
                <div key={event.id} className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{event.dept}</p>
                    <h4 className="mt-0.5 text-sm font-medium">{event.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{event.date} · {event.slots - event.booked} slots left</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="mt-2 w-full border-dashed">
                <Plus className="mr-1 h-3 w-3" />
                Plan new team day
              </Button>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-primary/5 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-serif text-lg tracking-tight">AI Compliance Insight</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your current volunteer distribution satisfies **84% of Section 135** requirements for the upcoming financial year. We recommend adding 2 more "Education" sector projects to reach 100%.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0 text-xs text-primary">
                View Compliance Breakdown
              </Button>
            </div>
          </div>
        </div>

        {/* Global Impact Map Preview */}
        <section className="mt-16 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-primary">
                <Globe className="h-5 w-5" />
                <span className="font-mono text-[11px] uppercase tracking-widest">Global CSR Footprint</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight">Real-time Employee Impact Map</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Visualize where your workforce is contributing in real-time. From rural schools to disaster response units, see your brand's impact across the globe.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="font-serif text-3xl tabular-nums">42</p>
                  <p className="text-xs text-muted-foreground">Cities covered</p>
                </div>
                <div>
                  <p className="font-serif text-3xl tabular-nums">8.2</p>
                  <p className="text-xs text-muted-foreground">Avg Trust Score</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-video w-full max-w-xl rounded-2xl border border-border bg-muted/50 p-4">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                {/* Simplified Map Visualization */}
                <div className="grid grid-cols-4 gap-4 opacity-40">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button variant="secondary" className="gap-2 shadow-xl">
                    <Activity className="h-4 w-4" />
                    Open Live Impact Board
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CorporateShell>
  )
}
