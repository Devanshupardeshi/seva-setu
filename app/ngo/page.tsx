"use client"

import Link from "next/link"
import {
  Book,
  Clock3,
  FileText,
  Palette,
  Plus,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { NgoShell } from "@/components/app-shell/ngo-shell"
import { NeedRow } from "@/components/ngo/need-row"
import { StatCard } from "@/components/ngo/stat-card"
import { Button } from "@/components/ui/button"
import {
  applicantsByNeedId,
  currentCoordinator,
  currentNgo,
  extendedMyNeeds as mockNeeds,
  ngoStats as mockStats,
  recentCompleted,
} from "@/lib/mock-ngo-data"
import { useCollection } from "@/hooks/use-firestore"
import { EmptyState } from "@/components/empty-state"
import { Need } from "@/lib/types"
import { where } from "firebase/firestore"
import { useMemo } from "react"

export default function NgoDashboardPage() {
  // Real-time needs for this NGO. In Actual Mode the hook returns the live
  // snapshot (no fallback to mock data when empty).
  const { data: activeNeeds, isActual } = useCollection<Need>(
    "needs",
    [where("ngoId", "==", currentNgo.id)],
    mockNeeds,
  )

  const urgent = activeNeeds.filter((n) => n.urgency !== "routine")
  const routine = activeNeeds.filter((n) => n.urgency === "routine")

  // Reactively calculate some stats. In Actual Mode we don't have aggregations
  // wired up yet, so show zeroes instead of the demo fixture numbers.
  const stats = useMemo(() => {
    if (isActual) {
      return {
        openNeeds: activeNeeds.length,
        applicantsWaiting: 0,
        hoursThisMonth: 0,
        childrenReachedThisMonth: 0,
        avgTimeToFill: "—",
      }
    }
    return {
      ...mockStats,
      openNeeds: activeNeeds.length,
    }
  }, [activeNeeds, isActual])

  return (
    <NgoShell
      ngoName={currentNgo.name}
      darpanId={currentNgo.darpanId}
      coordinatorName={currentCoordinator.name}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Good afternoon, {currentCoordinator.name.split(" ")[0]}
            </div>
            <h1 className="mt-1 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              You have {stats.applicantsWaiting} volunteers awaiting review.
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Gemini ranked each one by skill fit, distance, trust score and past
              reliability. Shortlist with one tap.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/ngo/post">
              <Plus className="mr-1 h-4 w-4" />
              Post a need
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Open needs"
            value={stats.openNeeds}
            helper={`${stats.openNeeds} posts live`}
            icon={FileText}
            accent
          />
          <StatCard
            label="Applicants waiting"
            value={stats.applicantsWaiting}
            helper={`Across ${activeNeeds.length} needs`}
            icon={Users}
          />
          <StatCard
            label="Hours this month"
            value={stats.hoursThisMonth}
            helper={`${stats.childrenReachedThisMonth} children reached`}
            icon={Clock3}
          />
          <StatCard
            label="Avg time to fill"
            value={stats.avgTimeToFill}
            helper="Updated in real-time"
            icon={Sparkles}
          />
        </div>

        {urgent.length > 0 && (
          <section className="mt-12">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-2xl tracking-tight">
                Needs to watch
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Priority · unfilled soon
              </span>
            </div>
            <div className="grid gap-3">
              {urgent.map((need) => (
                <NeedRow
                  key={need.id}
                  need={need}
                  applicants={applicantsByNeedId[need.id]?.length ?? 0}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl tracking-tight">Active needs</h2>
            <Link
              href="/ngo/needs"
              className="font-mono text-[11px] uppercase tracking-wider text-primary"
            >
              See all
            </Link>
          </div>
          {routine.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={isActual ? "No active needs yet" : "Quiet week"}
              description={
                isActual
                  ? "Click 'Post a need' to publish your first opportunity. Volunteers will be matched in real-time."
                  : "No routine needs are open right now."
              }
              action={
                <Button asChild size="sm">
                  <Link href="/ngo/post">
                    <Plus className="mr-1 h-4 w-4" />
                    Post a need
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3">
              {routine.map((need) => (
                <NeedRow
                  key={need.id}
                  need={need}
                  applicants={applicantsByNeedId[need.id]?.length ?? 0}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center gap-2">
            <h2 className="font-serif text-2xl tracking-tight">Recent impact</h2>
            <div className="flex h-5 items-center gap-1 rounded-full bg-primary/10 px-2 text-[10px] font-medium text-primary">
              <Star className="h-3 w-3 fill-primary" />
              Top 5% NGO
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentCompleted.map((item, i) => {
              const Icon = [Book, Users, Palette][i % 3]
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-lg leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>
                  <div className="mt-auto pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Volunteer
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {item.volunteer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </NgoShell>
  )
}
