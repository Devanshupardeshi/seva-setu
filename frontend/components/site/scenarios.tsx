import { CloudRain, GraduationCap, Building2 } from "lucide-react"

const scenarios = [
  {
    icon: CloudRain,
    tag: "Disaster",
    title: "A flood hits Assam at 4 AM.",
    body: "200 villagers need rescue. An NGO posts in 12 WhatsApp groups. 500 people want to help but nobody knows who has a boat, first-aid training, or speaks Assamese. 12 hours later, coordination is still broken.",
    outcome: "With SevaSetu: 342 skill-matched volunteers dispatched in 47 seconds.",
  },
  {
    icon: GraduationCap,
    tag: "Volunteer",
    title: "Priya wants to volunteer on weekends.",
    body: "She fills out five NGO forms. Hears back from none. The one task she finally gets is folding pamphlets — nothing to do with her Python skills. She quits within two months.",
    outcome: "With SevaSetu: a one-minute profile lands her a coding-for-kids gig by Saturday.",
  },
  {
    icon: Building2,
    tag: "NGO",
    title: "Shiksha Kendra runs on two people.",
    body: "They need a Hindi-speaking math tutor, a one-time graphic designer, and a monthly doctor. They post on Facebook. A hundred DMs arrive. They spend ten hours filtering, then give up.",
    outcome: "With SevaSetu: describe the need in plain English. Pre-ranked applicants in seconds.",
  },
]

export function Scenarios() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            The problem
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            India doesn&apos;t lack willing hands.
            <span className="italic text-primary"> It lacks a bridge.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Three real situations we heard over and over while researching this
            problem. Every single one of them is solvable by better matching,
            better language support, and faster mobilization.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {scenarios.map((s) => {
            const Icon = s.icon
            return (
              <article
                key={s.title}
                className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-balance font-serif text-2xl leading-tight text-foreground">
                  {s.title}
                </h3>

                <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>

                <div className="mt-auto border-t border-dashed border-border pt-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    <span className="font-medium text-primary">→ </span>
                    {s.outcome}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
