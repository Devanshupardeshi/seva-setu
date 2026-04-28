import { UserPlus, FileText, Sparkles, MapPin } from "lucide-react"

const steps = [
  {
    n: "01",
    icon: UserPlus,
    title: "Volunteer creates a lightweight profile",
    body: "Skills, languages, availability windows, and location captured in a minute. Gemini turns the free-text bio into a clean structured embedding.",
  },
  {
    n: "02",
    icon: FileText,
    title: "NGO describes a need in plain words",
    body: "\"Need an Assamese-speaking coordinator this Saturday in Majuli.\" Gemini turns the sentence into a structured, matchable need.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Vertex AI matches on meaning, not keywords",
    body: "Vector search finds the closest semantic matches, then re-ranks by distance, availability, and trust score — in under a second.",
  },
  {
    n: "04",
    icon: MapPin,
    title: "Briefed, routed, notified",
    body: "Gemini drafts a personalized briefing. Google Maps delivers the route. FCM web push wakes the volunteer when a match lands.",
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            How it works
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            Four steps.
            <span className="italic text-primary"> Zero forms.</span>
          </h2>
        </div>
        <p className="max-w-md text-pretty text-muted-foreground">
          Built end-to-end on Google Cloud with Gemini, Vertex AI, Firebase, and
          Maps Platform.
        </p>
      </div>

      <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <li
              key={step.n}
              className="group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  {step.n}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>

              <h3 className="text-balance font-serif text-xl leading-tight text-foreground">
                {step.title}
              </h3>

              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>

              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-border lg:block"
                />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
