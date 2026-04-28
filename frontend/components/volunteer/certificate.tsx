import { Award, BadgeCheck } from "lucide-react"
import type { Volunteer } from "@/lib/types"

export function Certificate({ volunteer }: { volunteer: Volunteer }) {
  const year = new Date().getFullYear()

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-primary/5 to-accent/10 p-8 md:p-10">
      {/* corner ornaments */}
      <div className="absolute left-6 top-6 h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-primary/50" />
      <div className="absolute right-6 top-6 h-8 w-8 rounded-tr-2xl border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-6 left-6 h-8 w-8 rounded-bl-2xl border-b-2 border-l-2 border-primary/50" />
      <div className="absolute bottom-6 right-6 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-primary/50" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
          <Award className="h-3.5 w-3.5" />
          Certificate of Service · {year}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          SevaSetu · Verified
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          This certifies that
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
          {volunteer.name}
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
          has generously contributed{" "}
          <span className="text-foreground">{volunteer.hoursGiven} hours</span>{" "}
          across{" "}
          <span className="text-foreground">
            {volunteer.projectsCompleted} verified projects
          </span>{" "}
          reaching{" "}
          <span className="text-foreground">
            {volunteer.peopleHelped} people
          </span>{" "}
          across partner NGOs — advancing SDG 3, 11 and 17.
        </p>
      </div>

      <div className="mt-10 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Issued
          </div>
          <div className="mt-1 text-sm">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <BadgeCheck className="h-5 w-5 text-primary" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Verifier
            </div>
            <div className="text-sm">Cloud-signed · {volunteer.id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
