import Link from "next/link"
import { ArrowRight, CalendarCheck, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttendanceQRModal } from "./attendance-qr-modal"
import type { NGO, Need } from "@/lib/types"

function formatWhen(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function ActiveMatch({ need, ngo }: { need: Need; ngo: NGO }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-primary">
        <CalendarCheck className="h-3.5 w-3.5" />
        Your upcoming gig
      </div>
      <h3 className="mt-3 text-balance font-serif text-3xl leading-tight tracking-tight md:text-4xl">
        {need.title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        with <span className="text-foreground">{ngo.name}</span>
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {formatWhen(need.startTime)}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {need.location.label}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href={`/volunteer/matches/${need.id}`}>
            Open briefing
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <AttendanceQRModal 
          volunteerId="v_1" // currentVolunteer.id
          needId={need.id}
          matchId={`m_${need.id}`}
        />
        <Button asChild variant="outline">
          <Link href={`/volunteer/matches/${need.id}#route`}>View route</Link>
        </Button>
      </div>
    </div>
  )
}
