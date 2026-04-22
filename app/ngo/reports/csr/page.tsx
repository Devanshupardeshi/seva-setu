"use client"

import { useState } from "react"
import { 
  Download, 
  FileCheck, 
  FileText, 
  LayoutDashboard, 
  PieChart, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { NgoShell } from "@/components/app-shell/ngo-shell"
import { Button } from "@/components/ui/button"
import { currentNgo, currentCoordinator } from "@/lib/mock-ngo-data"
import { cn } from "@/lib/utils"

interface GeneratedReport {
  title: string
  summary: string
  sdgs: string[]
  metrics: { label: string; value: string }[]
  story: string
  complianceNote: string
}

export default function CSRReportPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState<GeneratedReport | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/reports/csr/generate", {
        method: "POST",
        body: JSON.stringify({
          ngoData: currentNgo,
          pastActivities: [
            { title: "HTML Workshop", hours: 48, beneficiaries: 120 },
            { title: "Mobile Coding", hours: 32, beneficiaries: 85 }
          ]
        })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setReport(data)
    } catch (error: any) {
      console.error("Report generation failed:", error)
      alert(error.message || "Failed to generate report.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (title: string) => {
    // Create a fake text file to simulate PDF download
    const element = document.createElement("a")
    const file = new Blob([`SevaSetu CSR Impact Report: ${title}\n\nGenerated for: ${currentNgo.name}\nDate: ${new Date().toLocaleDateString()}\n\nThis is a verifiable impact document.`], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <NgoShell
      ngoName={currentNgo.name}
      darpanId={currentNgo.darpanId}
      coordinatorName={currentCoordinator.name}
    >
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Compliance & Funding
            </div>
            <h1 className="mt-1 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              CSR Impact Reports
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Generate ready-to-use impact reports for your corporate funders. These reports follow the format required by the Companies Act 2013 (Section 135).
            </p>
          </div>
          <Button 
            className="gap-2" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Data...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI-Generate New Report
              </>
            )}
          </Button>
        </div>

        {report && (
          <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-500 rounded-3xl border border-primary/20 bg-primary/5 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="font-serif text-2xl">{report.title}</h2>
              </div>
              <Button size="sm" onClick={() => handleDownload(report.title)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Executive Summary</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.sdgs.map((sdg, i) => (
                    <span key={i} className="rounded-full bg-background border border-border px-3 py-1 text-[10px] uppercase tracking-wider font-medium">
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {report.metrics.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-background p-4 text-center">
                      <div className="text-2xl font-serif text-primary">{m.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[10px] uppercase tracking-widest">Compliance Note</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                    {report.complianceNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-serif text-xl">Sector-wise Impact</h3>
            <p className="mt-2 text-sm text-muted-foreground">Automatic mapping of your projects to Schedule VII sectors (Education, Health, Environment).</p>
          </div>
          
          <div className="rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-serif text-xl">Outcome Metrics</h3>
            <p className="mt-2 text-sm text-muted-foreground">Calculated social return on investment (SROI) and employee engagement scores.</p>
          </div>
          
          <div className="rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-serif text-xl">Verified Evidence</h3>
            <p className="mt-2 text-sm text-muted-foreground">Attendance logs and feedback summaries verified via SevaSetu trust protocols.</p>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-4">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Recent Reports</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { title: "Q1 Impact Summary - Infosys Foundation", date: "April 15, 2026", size: "2.4 MB" },
              { title: "Annual CSR Compliance - HDFC Bank", date: "March 30, 2026", size: "5.1 MB" },
              { title: "Rural Education Drive Outcomes", date: "Feb 12, 2026", size: "1.8 MB" }
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-6 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{report.title}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{report.date} · {report.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleDownload(report.title)}>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NgoShell>
  )
}
