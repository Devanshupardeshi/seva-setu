"use client"

import { useParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Printer, 
  ShieldCheck, 
  Users,
  MapPin,
  Clock,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandShell } from "@/components/app-shell/command-shell"
import { incidentOperator, activeIncident } from "@/lib/mock-data"

export default function GovernmentReportPage() {
  const { id } = useParams()
  const router = useRouter()

  return (
    <CommandShell
      operatorName={incidentOperator.name}
      operatorRole={incidentOperator.role}
      office={incidentOperator.office}
      incidentTitle="Post-Incident Report"
      severity="low"
      activeSince="Finalized"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8 gap-2 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Command Center
        </Button>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-white text-black shadow-xl">
              {/* Report Header */}
              <div className="border-b-2 border-black bg-muted/20 p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <h1 className="mt-6 font-serif text-3xl uppercase tracking-tighter">Incident Summary Report</h1>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">NDMA Standard Form 7-B</p>
              </div>

              {/* Report Content */}
              <div className="p-10 space-y-10">
                <section>
                  <h3 className="border-b border-black/10 pb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">01. Incident Context</h3>
                  <div className="mt-4 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Incident Title</p>
                      <p className="mt-1 font-serif text-xl">{activeIncident.title}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Epicenter</p>
                      <p className="mt-1 font-serif text-xl">{activeIncident.epicenter.label}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Activation Time</p>
                      <p className="mt-1 font-serif text-xl">2026-04-10 14:20 IST</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Duration</p>
                      <p className="mt-1 font-serif text-xl">4 Days 12 Hours</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="border-b border-black/10 pb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">02. Mobilization Metrics</h3>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-muted/30 p-4 text-center">
                      <p className="font-serif text-4xl">1,240</p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Total Responders</p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4 text-center">
                      <p className="font-serif text-4xl">12m</p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Avg. Deployment Time</p>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-4 text-center">
                      <p className="font-serif text-4xl">98%</p>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Skill Matching Accuracy</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="border-b border-black/10 pb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">03. Operational Timeline</h3>
                  <div className="mt-6 space-y-4">
                    {[
                      { time: "T+00:04", event: "Incident declared. Geo-fencing active." },
                      { time: "T+00:12", event: "Initial 400 SMS/WhatsApp alerts dispatched." },
                      { time: "T+01:45", event: "First responders (Medical) reported on site." },
                      { time: "T+06:00", event: "Embankment secured. Radius expansion deactivated." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 text-sm">
                        <span className="font-mono font-bold text-primary">{step.time}</span>
                        <span className="text-muted-foreground">{step.event}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="pt-10 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Digitally Signed: SevaSetu-EOC</span>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em]">Page 1 of 4</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl tracking-tight">Report Actions</h3>
                <div className="mt-6 grid gap-3">
                  <Button className="w-full gap-2" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                    Print / Export PDF
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    NDMA XML Format
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-primary/5 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <History className="h-4 w-4" />
                  <h4 className="font-mono text-[10px] uppercase tracking-widest">Audit Trail</h4>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  This report was generated using the SevaSetu Immutable Ledger. Any tampering with metrics will invalidate the digital signature.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </CommandShell>
  )
}
