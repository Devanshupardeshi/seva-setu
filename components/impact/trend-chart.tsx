import { TrendingUp } from "lucide-react"
import { weeklyTrend } from "@/lib/mock-impact-data"

export function TrendChart() {
  const w = 800
  const h = 260
  const pad = { t: 16, r: 16, b: 32, l: 40 }
  const max = Math.max(...weeklyTrend.map((d) => d.hours))
  const xStep = (w - pad.l - pad.r) / (weeklyTrend.length - 1)

  const points = weeklyTrend.map((d, i) => {
    const x = pad.l + i * xStep
    const y = pad.t + (1 - d.hours / max) * (h - pad.t - pad.b)
    return { x, y, ...d }
  })

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - pad.b} L ${pad.l} ${h - pad.b} Z`

  const totalHours = weeklyTrend.reduce((a, d) => a + d.hours, 0)
  const lastWeekDelta =
    weeklyTrend.length > 1
      ? ((weeklyTrend[weeklyTrend.length - 1].hours -
          weeklyTrend[weeklyTrend.length - 2].hours) /
          weeklyTrend[weeklyTrend.length - 2].hours) *
        100
      : 0

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            12-week trajectory
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            Compounding
            <span className="italic text-primary"> service.</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Weekly verified hours since the pilot opened — each point is a sum
            of QR-checked, geofence-verified, or signature-verified sessions.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Cumulative hours
              </p>
              <p className="mt-1 font-serif text-4xl leading-none text-foreground tabular-nums">
                {totalHours.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Week-over-week
              </p>
              <p className="mt-1 flex items-center gap-2 font-serif text-4xl leading-none text-foreground">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="tabular-nums">{lastWeekDelta.toFixed(1)}%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Verified hours · weekly
              </span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Source · BigQuery
              </span>
            </div>
            <svg
              viewBox={`0 0 ${w} ${h}`}
              className="h-[260px] w-full"
              role="img"
              aria-label="Line chart of weekly verified hours"
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                const y = pad.t + p * (h - pad.t - pad.b)
                return (
                  <line
                    key={p}
                    x1={pad.l}
                    x2={w - pad.r}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeOpacity="0.7"
                  />
                )
              })}

              <path d={areaPath} fill="url(#trendFill)" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {points.map((p) => (
                <g key={p.week}>
                  <circle cx={p.x} cy={p.y} r="3.5" fill="var(--primary)" />
                  <text
                    x={p.x}
                    y={h - pad.b + 18}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-[10px] uppercase tracking-widest"
                  >
                    {p.week}
                  </text>
                </g>
              ))}

              {[0, 0.5, 1].map((p) => {
                const y = pad.t + p * (h - pad.t - pad.b)
                const v = Math.round(max * (1 - p))
                return (
                  <text
                    key={p}
                    x={pad.l - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="fill-muted-foreground font-mono text-[10px] tabular-nums"
                  >
                    {v}
                  </text>
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
