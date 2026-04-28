"use client"
import { useState } from "react"
import Link from "next/link"
import { HandHeart, Mic, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VolunteerShell } from "@/components/app-shell/volunteer-shell"
import { cn } from "@/lib/utils"
import { ProfileCard } from "@/components/volunteer/profile-card"
import { ActiveMatch } from "@/components/volunteer/active-match"
import { MatchCard } from "@/components/volunteer/match-card"
import { ImpactSnapshot } from "@/components/volunteer/impact-snapshot"
import { EmptyState } from "@/components/empty-state"
import {
  currentVolunteer,
  matches as mockMatches,
  needs as mockNeeds,
  ngos as mockNgos,
} from "@/lib/mock-data"
import { useCollection } from "@/hooks/use-firestore"
import { Match, Need, NGO } from "@/lib/types"
import { where } from "firebase/firestore"
import { useMemo } from "react"

export default function VolunteerHome() {
  // Real-time matches for this volunteer.
  // The hook returns the mock fixture only in Demo Mode; in Actual Mode it
  // returns the live snapshot (empty arrays stay empty).
  const { data: activeMatches, isActual } = useCollection<Match>(
    "matches",
    [where("volunteerId", "==", currentVolunteer.id)],
    mockMatches,
  )

  const { data: activeNeeds } = useCollection<Need>("needs", [], mockNeeds)
  const { data: activeNgos } = useCollection<NGO>("ngos", [], mockNgos)

  // Calculate upcoming match
  const upcomingMatch = activeMatches.find((m) => m.status === "accepted")
  
  const upcomingNeed = useMemo(() => 
    upcomingMatch ? activeNeeds.find(n => n.id === upcomingMatch.needId) : null
  , [upcomingMatch, activeNeeds])

  const upcomingNgo = useMemo(() => 
    upcomingNeed ? activeNgos.find(n => n.id === upcomingNeed.ngoId) : null
  , [upcomingNeed, activeNgos])

  const [womenOnly, setWomenOnly] = useState(false)

  // Feed = everything other than the already-accepted one, ranked by match score
  const feed = useMemo(() => {
    let filtered = activeNeeds
      .filter((n) => n.id !== upcomingNeed?.id)

    if (womenOnly) {
      filtered = filtered.filter(n => n.tags?.includes('women-only'))
    }

    return filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  }, [activeNeeds, upcomingNeed, womenOnly])

  return (
    <VolunteerShell
      userName={currentVolunteer.name}
      userLocation={currentVolunteer.location.label}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Saturday, 25 April
            </p>
            <h1 className="mt-2 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              Welcome back, {currentVolunteer.name.split(" ")[0]}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Here are the opportunities our matching engine surfaced for you
              this weekend.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={womenOnly ? "secondary" : "outline"} 
              size="sm" 
              className={cn("gap-2", womenOnly && "border-pink-500/20 bg-pink-500/10 text-pink-600 hover:bg-pink-500/20")}
              onClick={() => setWomenOnly(!womenOnly)}
            >
              Women-only tasks
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/volunteer/onboarding">
                <Mic className="mr-1.5 h-4 w-4" />
                Re-record your profile
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            {upcomingNeed && upcomingNgo && (
              <ActiveMatch need={upcomingNeed} ngo={upcomingNgo} />
            )}

            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-2xl leading-tight tracking-tight">
                  Matched for you
                </h2>
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3" />
                  Vertex AI · live feed
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by skill fit, distance, and availability. Re-calculated in real-time as NGOs post needs.
              </p>
              {feed.length === 0 ? (
                <EmptyState
                  className="mt-5"
                  icon={HandHeart}
                  title={
                    isActual
                      ? "No active opportunities yet"
                      : "All caught up"
                  }
                  description={
                    isActual
                      ? "NGOs haven't posted needs that match your profile. We'll notify you the moment a match shows up."
                      : "There are no open needs right now. Check back later."
                  }
                />
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {feed.map((need) => {
                    const ngo = activeNgos.find((n) => n.id === need.ngoId)
                    if (!ngo) return null
                    return <MatchCard key={need.id} need={need} ngo={ngo} />
                  })}
                </div>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <ProfileCard volunteer={currentVolunteer} />
            <ImpactSnapshot volunteer={currentVolunteer} />
          </aside>
        </div>
      </div>
    </VolunteerShell>
  )
}
