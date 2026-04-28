import { sdgProgress } from "@/lib/mock-impact-data"

function Gauge({ pct, tone }: { pct: number; tone: "primary" | "accent" }) {
  const r = 62
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <svg viewBox="0 0 160 160" className="h-36 w-36 -rotate-90">
      <circle
        cx="80"
        cy="80"
        r={r}
        stroke="var(--border)"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="80"
        cy="80"
        r={r}
        stroke={tone === "accent" ? "var(--accent)" : "var(--primary)"}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        fill="none"
      />
    </svg>
  )
}

export function SdgGauges() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            UN Sustainable Development Goals
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            Progress against
            <span className="italic text-primary"> three pilot goals.</span>
          </h2>
        </div>
        <p className="max-w-md text-pretty text-sm text-muted-foreground">
          Every completed match contributes to one or more SDGs. We publish the
          raw BigQuery view so any partner can audit the math.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {sdgProgress.map((s, i) => {
          const pct = Math.round((s.current / s.target) * 100)
          const tone = i === 1 ? "accent" : "primary"
          return (
            <article
              key={s.number}
              className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-7"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl font-serif text-2xl ${
                    tone === "accent"
                      ? "bg-accent/15 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {s.number}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  SDG {s.number}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl leading-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {s.headline}
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <Gauge pct={pct} tone={tone} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-4xl leading-none text-foreground tabular-nums">
                    {pct}%
                  </span>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    of pilot target
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-t border-border pt-4 text-sm">
                <span className="tabular-nums text-foreground">
                  {s.current.toLocaleString("en-IN")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  of {s.target.toLocaleString("en-IN")} {s.unit}
                </span>
              </div>

              <ul className="flex flex-col gap-2 text-sm">
                {s.breakdown.map((b) => {
                  const total = s.breakdown.reduce((acc, x) => acc + x.value, 0)
                  const p = total === 0 ? 0 : (b.value / total) * 100
                  return (
                    <li key={b.label} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-foreground">{b.label}</span>
                          <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {b.value}
                          </span>
                        </div>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={
                              tone === "accent" ? "h-full bg-accent" : "h-full bg-primary"
                            }
                            style={{ width: `${p}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
