import { BookOpen, Navigation2, Package, ShieldCheck, Sparkles, Users } from "lucide-react"
import type { Briefing } from "@/lib/types"

type Section = {
  key: keyof Briefing
  label: string
  icon: typeof BookOpen
  tone: string
}

const sections: Section[] = [
  { key: "prep", label: "What to know about the audience", icon: Users, tone: "bg-primary/5 border-primary/30" },
  { key: "lessonPlan", label: "Suggested lesson plan", icon: BookOpen, tone: "bg-accent/10 border-accent/40" },
  { key: "whatToBring", label: "What to bring", icon: Package, tone: "bg-card border-border" },
  { key: "culturalNotes", label: "Cultural notes", icon: Sparkles, tone: "bg-card border-border" },
  { key: "safety", label: "Safety & contact", icon: ShieldCheck, tone: "bg-card border-border" },
]

export function BriefingView({ briefing }: { briefing: Briefing }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Drafted by Gemini from this NGO&apos;s context
      </div>

      {sections.map((s) => {
        const value = briefing[s.key]
        if (!value || (Array.isArray(value) && value.length === 0)) return null
        const Icon = s.icon
        return (
          <div
            key={s.key}
            className={"rounded-2xl border p-5 " + s.tone}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-lg tracking-tight">{s.label}</h3>
            </div>
            <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-foreground">
              {(value as string[]).map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      <div id="route" className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Navigation2 className="h-4 w-4 text-primary" />
          <h3 className="font-serif text-lg tracking-tight">Route</h3>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Mode
            </div>
            <div className="mt-1 text-sm">{briefing.route.mode}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Distance
            </div>
            <div className="mt-1 text-sm">{briefing.route.distanceKm} km</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              ETA
            </div>
            <div className="mt-1 text-sm">{briefing.route.etaMin} min</div>
          </div>
        </div>
        <ol className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          {briefing.route.landmarks.map((l, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{l}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
