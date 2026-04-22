import Link from "next/link"
import { Plus } from "lucide-react"
import { NgoShell } from "@/components/app-shell/ngo-shell"
import { NeedRow } from "@/components/ngo/need-row"
import { Button } from "@/components/ui/button"
import {
  applicantsByNeedId,
  currentCoordinator,
  currentNgo,
  extendedMyNeeds,
} from "@/lib/mock-ngo-data"

export default function NgoNeedsIndexPage() {
  return (
    <NgoShell
      ngoName={currentNgo.name}
      darpanId={currentNgo.darpanId}
      coordinatorName={currentCoordinator.name}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Your volunteer needs
            </div>
            <h1 className="mt-1 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {extendedMyNeeds.length} live needs
            </h1>
          </div>
          <Button asChild size="lg">
            <Link href="/ngo/post">
              <Plus className="mr-1 h-4 w-4" />
              Post a need
            </Link>
          </Button>
        </div>

        <div className="grid gap-3">
          {extendedMyNeeds.map((need) => (
            <NeedRow
              key={need.id}
              need={need}
              applicants={applicantsByNeedId[need.id]?.length ?? 0}
            />
          ))}
        </div>
      </div>
    </NgoShell>
  )
}
