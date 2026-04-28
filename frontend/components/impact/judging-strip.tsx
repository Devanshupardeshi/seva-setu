import { rubric } from "@/lib/mock-impact-data"

export function JudgingStrip() {
  const total = rubric.reduce((a, r) => a + r.score, 0)
  const maxTotal = rubric.reduce((a, r) => a + r.weight, 0)
  const pct = Math.round((total / maxTotal) * 100)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Google Solution Challenge 2026 · scoring rubric
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            Aligned against
            <span className="italic text-primary"> every criterion.</span>
          </h2>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-6xl leading-none text-foreground tabular-nums">
            {total}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            / {maxTotal} · self-scored ({pct}%)
          </span>
        </div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rubric.map((r) => {
          const p = Math.round((r.score / r.weight) * 100)
          return (
            <article
              key={r.label}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-lg text-foreground">{r.label}</h3>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Weight {r.weight}%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-5xl leading-none text-foreground tabular-nums">
                  {r.score}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  / {r.weight}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${p}%` }}
                />
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {r.evidence}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
