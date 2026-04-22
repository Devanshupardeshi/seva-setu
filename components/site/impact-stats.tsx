const stats = [
  { label: "Pilot NGOs onboarded", value: "10", sub: "across 3 states" },
  { label: "Volunteers matched", value: "500+", sub: "in 4 weeks" },
  { label: "Languages supported", value: "6", sub: "Hindi, EN, MR, TA, TE, BN" },
  { label: "Disaster drill mobilized", value: "342", sub: "in under 60 seconds" },
]

export function ImpactStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Pilot targets
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            Traction we will
            <span className="italic text-primary"> show on demo day.</span>
          </h2>
        </div>
        <p className="max-w-md text-pretty text-sm text-muted-foreground">
          These are the numbers we are pre-committing to hit before the Google
          Solution Challenge 2026 finals.
        </p>
      </div>

      <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-6"
          >
            <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-serif text-5xl leading-none text-foreground">
              {s.value}
            </dd>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </dl>
    </section>
  )
}
