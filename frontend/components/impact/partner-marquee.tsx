import { partners } from "@/lib/mock-impact-data"

function tint(type: string) {
  if (type === "Gov") return "border-accent/40 bg-accent/5 text-accent"
  if (type === "CSR") return "border-primary/30 bg-primary/5 text-primary"
  if (type === "University") return "border-foreground/20 bg-muted text-foreground"
  return "border-border bg-card text-foreground"
}

export function PartnerMarquee() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Pilot partners
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            14 NGOs, 2 state agencies,
            <span className="italic text-primary"> one civic layer.</span>
          </h2>
        </div>
        <p className="max-w-md text-pretty text-sm text-muted-foreground">
          Every partner passes Darpan ID verification and signs a data-use
          agreement before publishing needs.
        </p>
      </div>

      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-4 ${tint(p.type)}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background font-serif text-base">
              {p.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base text-foreground">
                {p.name}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {p.type} · {p.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
