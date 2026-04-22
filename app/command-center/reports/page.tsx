import { ArrowLeft, FileBarChart } from "lucide-react"
import Link from "next/link"
import { CommandShell } from "@/components/app-shell/command-shell"
import { incidentOperator } from "@/lib/mock-incident-data"

export default function ReportsPage() {
  return (
    <CommandShell
      operatorName={incidentOperator.name}
      operatorRole={incidentOperator.role}
      office={incidentOperator.office}
      incidentTitle="Incident Reports"
      severity="yellow"
      activeSince="--"
    >
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/command-center"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to dashboard
        </Link>
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-20 text-center">
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <FileBarChart className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-serif text-3xl tracking-tight">SITREP Archive</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Complete incident reports and impact evaluations will appear here once the active incident is resolved.
          </p>
        </div>
      </div>
    </CommandShell>
  )
}
