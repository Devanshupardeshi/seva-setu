import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Users,
} from "lucide-react"
import { NgoShell } from "@/components/app-shell/ngo-shell"
import { ApplicantRow } from "@/components/ngo/applicant-row"
import { AttendanceQR } from "@/components/ngo/attendance-qr"
import { Button } from "@/components/ui/button"
import {
  applicantsByNeedId,
  currentCoordinator,
  currentNgo,
  extendedMyNeeds,
} from "@/lib/mock-ngo-data"

function formatWhen(iso: string) {
  const d = new Date(iso)
  const day = d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  return { day, time }
}

export default async function NgoNeedApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const need = extendedMyNeeds.find((n) => n.id === id)
  if (!need) notFound()

  const applicants = applicantsByNeedId[id] ?? []
  const shortlisted = applicants.filter((a) => a.status === "shortlisted").length
  const { day, time } = formatWhen(need.startTime)

  return (
    <NgoShell
      ngoName={currentNgo.name}
      darpanId={currentNgo.darpanId}
      coordinatorName={currentCoordinator.name}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/ngo"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to dashboard
        </Link>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {need.urgency === "routine"
                  ? "Routine need"
                  : "Priority need"}{" "}
                · {applicants.length} applicants · {shortlisted} shortlisted
              </div>
              <h1 className="mt-2 text-balance font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                {need.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {need.description}
              </p>
            </div>
            <div className="flex gap-2">
              <AttendanceQR needTitle={need.title} />
              <Button variant="outline" size="sm">
                <Share2 className="mr-1 h-3.5 w-3.5" />
                Share link
              </Button>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Meta icon={Calendar} label="When">
              {day} · {time}
            </Meta>
            <Meta icon={Clock} label="Duration">
              {need.durationHours} h
            </Meta>
            <Meta icon={MapPin} label="Where">
              {need.location.label}
            </Meta>
            <Meta icon={Users} label="Slots">
              {need.filled}/{need.slots} filled
            </Meta>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/60 p-4 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Gemini matching summary
            </span>
            <span className="text-muted-foreground">
              {applicants.length} profiles scored against skill, distance,
              language and trust. Top {Math.min(3, applicants.length)} highlighted.
            </span>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl tracking-tight">
              Ranked applicants
            </h2>
            <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Best first
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {applicants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                No applicants yet. New matches arrive within minutes of
                publishing.
              </div>
            ) : (
              applicants.map((a) => (
                <ApplicantRow key={a.volunteer.id} applicant={a} needId={need.id} />
              ))
            )}
          </div>
        </section>
      </div>
    </NgoShell>
  )
}

function Meta({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}
