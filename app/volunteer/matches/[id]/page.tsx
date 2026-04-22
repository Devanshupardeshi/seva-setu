"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useState } from "react"
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock,
  HelpCircle,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { VolunteerShell } from "@/components/app-shell/volunteer-shell"
import { BriefingView } from "@/components/volunteer/briefing"
import {
  currentVolunteer,
  getBriefingById,
  getNeedById,
  getNgoById,
} from "@/lib/mock-data"
import { db } from "@/lib/firebase/client"
import { doc, setDoc } from "firebase/firestore"
import { SafeRoutingWidget } from "@/components/volunteer/safe-routing"

function formatWhen(iso: string) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  }
}

export default function MatchDetailPage() {
  const { id } = useParams() as { id: string }
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const need = getNeedById(id)
  const ngo = need ? getNgoById(need.ngoId) : null
  const briefing = getBriefingById(id)
  
  if (!need || !ngo) return notFound()

  const when = formatWhen(need.startTime)

  const handleAcceptMatch = async () => {
    setLoading(true)
    try {
      const matchId = `m_${currentVolunteer.id}_${id}`
      const matchRef = doc(db, "matches", matchId)
      
      await setDoc(matchRef, {
        id: matchId,
        volunteerId: currentVolunteer.id,
        needId: id,
        ngoId: need.ngoId,
        status: "accepted",
        appliedAt: new Date().toISOString(),
      }, { merge: true })

      setAccepted(true)
    } catch (err) {
      console.error("Failed to accept match:", err)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <VolunteerShell
      userName={currentVolunteer.name}
      userLocation={currentVolunteer.location.label}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <Link
          href="/volunteer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to matches
        </Link>

        <div className="mt-5 rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              96% Skill Fit
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="max-w-2xl">
              <h1 className="font-serif text-3xl leading-tight tracking-tight text-foreground md:text-4xl">
                {need.title}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                at <span className="font-medium text-foreground">{ngo.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Verified NGO</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  ID: {ngo.darpanId}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">{when.date}</p>
              <p className="text-xs text-muted-foreground">Date</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">{when.time}</p>
              <p className="text-xs text-muted-foreground">Start Time</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">{need.location.label}</p>
              <p className="text-xs text-muted-foreground">Location</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                {need.durationHours} hours
              </p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">
                About the opportunity
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                {need.description}
              </p>

              <div className="mt-8 flex flex-col gap-8">
                {briefing && (
                  <>
                    <SafeRoutingWidget 
                      volunteerLoc={currentVolunteer.location}
                      destinationLoc={need.location}
                      closedRoads={[
                        { name: "NH-15 Bypass", reason: "Flooded" },
                        { name: "Gogamukh Bridge", reason: "Restricted" }
                      ]}
                    />
                    <BriefingView briefing={briefing} />
                  </>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border bg-muted/20 p-6">
                <h3 className="font-serif text-xl tracking-tight">Apply now</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {need.slots} slots available. We recommend arriving 15 mins
                  early.
                </p>
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  onClick={handleAcceptMatch}
                  disabled={accepted || loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : accepted ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Applied Successfully
                    </>
                  ) : (
                    "Accept Match"
                  )}
                </Button>
                {accepted && (
                  <p className="mt-3 text-center text-xs text-primary animate-in fade-in slide-in-from-top-1">
                    Your details have been shared with {ngo.name}.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl tracking-tight">The NGO</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {ngo.about}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ngo.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </VolunteerShell>
  )
}
