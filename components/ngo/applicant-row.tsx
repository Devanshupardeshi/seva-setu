"use client"

import { useState } from "react"
import {
  Check,
  MapPin,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  X,
  CheckCircle2,
  MailCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Applicant } from "@/lib/mock-ngo-data"
import { db } from "@/lib/firebase/client"
import { doc, setDoc, updateDoc } from "firebase/firestore"

const statusStyles: Record<Applicant["status"], string> = {
  new: "bg-muted text-muted-foreground",
  shortlisted: "bg-primary/10 text-primary",
  messaged: "bg-accent/20 text-accent-foreground",
  declined: "bg-destructive/15 text-destructive",
}

export function ApplicantRow({ 
  applicant,
  needId 
}: { 
  applicant: Applicant
  needId?: string 
}) {
  const { volunteer, matchScore, distanceKm, availability, whyMatched } =
    applicant
  const [status, setStatus] = useState(applicant.status)
  const [loading, setLoading] = useState(false)
  const [messaged, setMessaged] = useState(false)

  const initials = volunteer.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")

  const handleStatusUpdate = async (newStatus: Applicant["status"]) => {
    setLoading(true)
    try {
      // In a real app, we'd have a 'matches' document for this applicant/need.
      // We'll update Firestore if we have a needId.
      if (needId) {
        const matchId = `m_${volunteer.id}_${needId}`
        await updateDoc(doc(db, "matches", matchId), {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }).catch(() => {
          // If update fails (e.g. doc doesn't exist), we'll try to create it
          return setDoc(doc(db, "matches", matchId), {
            id: matchId,
            volunteerId: volunteer.id,
            needId: needId,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }, { merge: true })
        })
      }
      setStatus(newStatus)
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = async () => {
    setLoading(true)
    try {
      // Simulate sending a Twilio/FCM message
      await fetch("/api/mobilize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volunteerIds: [volunteer.id],
          messageTemplate: `Hi ${volunteer.name}, this is Shiksha Kendra. We loved your profile for the teaching role! Are you free to chat?`,
        }),
      })
      setMessaged(true)
      setStatus("messaged")
    } catch (err) {
      console.error("Messaging error", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 transition-colors",
        status === "shortlisted"
          ? "border-primary/40"
          : "border-border hover:border-primary/30",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary font-medium">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-lg leading-none tracking-tight">
              {volunteer.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px]">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {volunteer.trustScore.toFixed(1)}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                statusStyles[status],
              )}
            >
              {status}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {volunteer.location.label} · {distanceKm.toFixed(1)} km
            </span>
            <span>{volunteer.projectsCompleted} projects</span>
            <span>{volunteer.hoursGiven} h given</span>
            <span>{availability}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {volunteer.skills.slice(0, 5).map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Why Gemini ranked this applicant · {matchScore}
              </div>
              <p className="mt-1 text-sm leading-relaxed">{whyMatched}</p>
            </div>
          </div>
        </div>

        <div className="hidden flex-col items-end gap-2 md:flex">
          <div className="text-right">
            <div className="font-serif text-3xl leading-none tracking-tight">
              {matchScore}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              match
            </div>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Shield className="h-3 w-3" />
            Darpan-matched
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={status === "shortlisted" ? "default" : "outline"}
            disabled={loading}
            onClick={() => handleStatusUpdate(status === "shortlisted" ? "new" : "shortlisted")}
          >
            {status === "shortlisted" ? (
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            ) : (
              <Check className="mr-1 h-3.5 w-3.5" />
            )}
            {status === "shortlisted" ? "Shortlisted" : "Shortlist"}
          </Button>
          
          <Button
            size="sm"
            variant={messaged ? "secondary" : "ghost"}
            disabled={loading || messaged}
            onClick={handleMessage}
          >
            {messaged ? (
              <MailCheck className="mr-1 h-3.5 w-3.5" />
            ) : (
              <MessageSquare className="mr-1 h-3.5 w-3.5" />
            )}
            {messaged ? "Message Sent" : "Message"}
          </Button>
        </div>
        <Button
          size="sm"
          variant="ghost"
          disabled={loading}
          className="text-muted-foreground hover:text-destructive"
          onClick={() => handleStatusUpdate("declined")}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Decline
        </Button>
      </div>
    </div>
  )
}
