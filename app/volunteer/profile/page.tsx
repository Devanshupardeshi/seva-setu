import { ArrowLeft, Download, Share2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VolunteerShell } from "@/components/app-shell/volunteer-shell"
import { Certificate } from "@/components/volunteer/certificate"
import {
  currentVolunteer,
  getNeedById,
  getNgoById,
  matches,
} from "@/lib/mock-data"

const sdgContributions = [
  { sdg: "SDG 3", title: "Good health", hours: 18, color: "bg-chart-1" },
  { sdg: "SDG 4", title: "Education", hours: 16, color: "bg-chart-2" },
  { sdg: "SDG 11", title: "Safe communities", hours: 8, color: "bg-chart-3" },
  { sdg: "SDG 13", title: "Climate action", hours: 6, color: "bg-chart-4" },
]

export default function ImpactPage() {
  const completed = matches
    .filter((m) => m.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completedAt || 0).getTime() -
        new Date(a.completedAt || 0).getTime(),
    )

  const totalHours = sdgContributions.reduce((s, x) => s + x.hours, 0)

  return (
    <VolunteerShell
      userName={currentVolunteer.name}
      userLocation={currentVolunteer.location.label}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <Link
          href="/volunteer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to home
        </Link>

        <div className="mt-5 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Your impact
            </p>
            <h1 className="mt-2 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {currentVolunteer.peopleHelped} lives,{" "}
              {currentVolunteer.hoursGiven} hours, and counting.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every gig you complete adds to a verifiable, shareable record —
              cloud-signed by SevaSetu and recognised by partner NGOs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              Download PDF
            </Button>
            <Button size="sm">
              <Share2 className="mr-1.5 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <Certificate volunteer={currentVolunteer} />

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                SDG contribution · {totalHours}h mapped
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {sdgContributions.map((s) => {
                  const pct = Math.round((s.hours / totalHours) * 100)
                  return (
                    <div key={s.sdg}>
                      <div className="flex items-center justify-between text-xs">
                        <span>
                          <span className="font-mono text-muted-foreground">
                            {s.sdg}
                          </span>{" "}
                          <span className="text-foreground">· {s.title}</span>
                        </span>
                        <span className="text-muted-foreground">
                          {s.hours}h · {pct}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full ${s.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-serif text-xl tracking-tight">
                  Recent activity
                </h2>
              </div>
              <ol className="divide-y divide-border">
                {completed.map((m) => {
                  const need = getNeedById(m.needId)
                  const ngo = need ? getNgoById(need.ngoId) : null
                  if (!need || !ngo) return null
                  const d = m.completedAt ? new Date(m.completedAt) : null
                  return (
                    <li
                      key={m.id}
                      className="flex items-start justify-between gap-4 px-5 py-4"
                    >
                      <div>
                        <div className="text-sm">{need.title}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {ngo.name} ·{" "}
                          {d?.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {m.reviewText && (
                          <p className="mt-2 max-w-xl text-xs italic text-muted-foreground">
                            &ldquo;{m.reviewText}&rdquo;
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-2xl leading-none">
                          {m.rating ?? "—"}
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          rating
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Reputation
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-5xl leading-none tracking-tight">
                  {currentVolunteer.trustScore.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Computed from NGO reviews, on-time arrival, and gig completion.
                Unlocks priority in disaster mode at 4.5+.
              </p>
            </div>

            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-accent">
                Next milestone
              </div>
              <div className="mt-2 font-serif text-xl tracking-tight">
                50-hour badge
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                2 more hours to unlock the Silver volunteer badge and annual
                partner-NGO recognition.
              </p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-accent"
                  style={{
                    width: `${(currentVolunteer.hoursGiven / 50) * 100}%`,
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </VolunteerShell>
  )
}
