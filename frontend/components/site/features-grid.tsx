import { HeartHandshake, Building2, ShieldAlert, Briefcase } from "lucide-react"

const personas = [
  {
    icon: HeartHandshake,
    audience: "For volunteers",
    headline: "Stop filling forms. Start helping.",
    features: [
      "Voice onboarding in Hindi, Marathi, Tamil, Telugu, Bengali & English",
      "Weekend-warrior mode — only surfaces free-time matches",
      "AI-generated prep kit for every gig",
      "Verified NGO badges + women-only task filter",
      "Auto-generated impact certificate after each task",
    ],
  },
  {
    icon: Building2,
    audience: "For NGOs",
    headline: "Post a need in plain words. Get the right people.",
    features: [
      "Darpan ID verified onboarding",
      "One-sentence need posting — Gemini handles the rest",
      "AI-ranked applicant shortlist, no spam DMs",
      "QR-based attendance tracking",
      "Auto-generated CSR impact reports for funders",
    ],
  },
  {
    icon: ShieldAlert,
    audience: "For government",
    headline: "One dashboard for every crisis.",
    features: [
      "Geofenced incident creation in one click",
      "Live heatmap of responders by skill and ETA",
      "Real-time skill-gap analysis",
      "Bulk mobilization via push, SMS & WhatsApp",
      "Post-event NDRF-ready PDF reports",
    ],
  },
  {
    icon: Briefcase,
    audience: "For corporates",
    headline: "Turn 3 lakh employees into impact.",
    features: [
      "Company-wide volunteer matching portal",
      "CSR compliance reporting (Companies Act 2013)",
      "Team-building volunteer days, one-click booked",
      "Live impact dashboard for the CSR board",
      "Cross-NGO partnership analytics",
    ],
  },
]

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Features
        </p>
        <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
          One platform.
          <span className="italic text-primary"> Four audiences.</span>
        </h2>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
          Volunteers, NGOs, government disaster managers, and corporate CSR
          teams — all coordinating through the same skill graph.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {personas.map((p) => {
          const Icon = p.icon
          return (
            <article
              key={p.audience}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {p.audience}
                </p>
              </div>

              <h3 className="text-balance font-serif text-3xl leading-tight text-foreground">
                {p.headline}
              </h3>

              <ul className="mt-2 flex flex-col gap-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground first:border-t-0 first:pt-0"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
