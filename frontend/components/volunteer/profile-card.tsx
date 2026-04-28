import { Check, Globe, MapPin, Sparkles, Star } from "lucide-react"
import type { Volunteer } from "@/lib/types"

const dayLabels: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
}

export function ProfileCard({ volunteer }: { volunteer: Volunteer }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-xl text-primary-foreground">
          {volunteer.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-serif text-2xl leading-tight tracking-tight">
              {volunteer.name}
            </h2>
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              <Check className="h-3 w-3" />
              Verified
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {volunteer.location.label}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {volunteer.languages.join(" · ")}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-accent" />
              {volunteer.trustScore} · {volunteer.projectsCompleted} projects
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Skills extracted by Gemini
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {volunteer.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Available
        </div>
        <div className="mt-2 flex gap-1.5">
          {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map(
            (d) => {
              const active = volunteer.availability.includes(d)
              return (
                <span
                  key={d}
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-md text-xs " +
                    (active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground")
                  }
                >
                  {dayLabels[d]}
                </span>
              )
            },
          )}
        </div>
      </div>
    </div>
  )
}
