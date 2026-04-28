const sdgs = [
  {
    n: "03",
    title: "Good Health & Well-being",
    body: "Faster medical response during disasters. Mental-health-trained volunteers matched to crisis hotlines.",
    tone: "primary",
  },
  {
    n: "11",
    title: "Sustainable Cities & Communities",
    body: "A civic coordination layer for every Indian city — from Mumbai potholes to Kolkata eldercare.",
    tone: "accent",
  },
  {
    n: "17",
    title: "Partnerships for the Goals",
    body: "One API joining NGOs, government, corporates, and citizens — the partnership India has been missing.",
    tone: "primary",
  },
]

export function SdgSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            UN Sustainable Development Goals
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            Three goals.
            <span className="italic text-primary"> Measurable impact.</span>
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every match, every mobilization, every hour served feeds a
            BigQuery-backed impact ledger — the same ledger that produces the
            reports NGOs share with funders and governments share with citizens.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {sdgs.map((s) => (
            <article
              key={s.n}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-xl font-serif text-3xl ${
                    s.tone === "accent"
                      ? "bg-accent/15 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {s.n}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  SDG {s.n}
                </span>
              </div>

              <h3 className="font-serif text-2xl leading-tight text-foreground">
                {s.title}
              </h3>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
