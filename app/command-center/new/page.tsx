"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertOctagon,
  Ambulance,
  ArrowLeft,
  Compass,
  Droplet,
  Flame,
  Loader2,
  Megaphone,
  Sun,
  Waves,
} from "lucide-react"
import { CommandShell } from "@/components/app-shell/command-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { incidentOperator } from "@/lib/mock-incident-data"
import { cn } from "@/lib/utils"

type IncidentType = "flood" | "fire" | "earthquake" | "medical" | "heatwave"
type Severity = "yellow" | "orange" | "red"

const types: {
  value: IncidentType
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { value: "flood", label: "Flood", icon: Waves },
  { value: "fire", label: "Fire", icon: Flame },
  { value: "earthquake", label: "Earthquake", icon: Compass },
  { value: "medical", label: "Medical", icon: Ambulance },
  { value: "heatwave", label: "Heatwave", icon: Sun },
]

const skillCatalog = [
  "First aid",
  "Medical doctor",
  "Boat operation",
  "Logistics",
  "Counselling",
  "Assamese translation",
  "Hindi translation",
  "Firefighting",
  "Search & rescue",
  "Cooking",
  "Data entry",
  "Driving",
]

export default function NewIncidentPage() {
  const router = useRouter()
  const [type, setType] = useState<IncidentType>("flood")
  const [severity, setSeverity] = useState<Severity>("red")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState(100)
  const [brief, setBrief] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(["First aid", "Medical doctor", "Logistics"]),
  )
  const [state, setState] = useState<"idle" | "parsing" | "ready">("idle")
  const [dispatching, setDispatching] = useState(false)

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  const runParse = () => {
    if (!brief.trim()) return
    setState("parsing")
    setTimeout(() => {
      // Heuristic Gemini-style extraction
      const lower = brief.toLowerCase()
      if (lower.includes("fire")) setType("fire")
      else if (lower.includes("earthquake")) setType("earthquake")
      else if (lower.includes("heat")) setType("heatwave")
      else if (lower.includes("medical") || lower.includes("ambulance"))
        setType("medical")
      else setType("flood")

      const match = brief.match(/(\d+)\s*km/i)
      if (match) setRadius(Math.min(500, Math.max(10, Number(match[1]))))

      const near = brief.match(/(?:in|at|near)\s+([A-Za-z\s]+?)(?:\.|,|$)/i)
      if (near && near[1]) setLocation(near[1].trim())

      if (!title) {
        setTitle(
          brief
            .split(/[.\n]/)[0]
            .slice(0, 80)
            .trim(),
        )
      }

      // Skills heuristic
      const next = new Set(selectedSkills)
      if (lower.includes("boat")) next.add("Boat operation")
      if (lower.includes("doctor") || lower.includes("medical"))
        next.add("Medical doctor")
      if (lower.includes("fire")) next.add("Firefighting")
      if (lower.includes("rescue")) next.add("Search & rescue")
      if (lower.includes("translat") || lower.includes("assamese"))
        next.add("Assamese translation")
      setSelectedSkills(next)

      setState("ready")
    }, 900)
  }

  const dispatch = () => {
    setDispatching(true)
    setTimeout(() => {
      router.push("/command-center")
    }, 1400)
  }

  return (
    <CommandShell
      operatorName={incidentOperator.name}
      operatorRole={incidentOperator.role}
      office={incidentOperator.office}
      incidentTitle="New incident · drafting"
      severity={severity === "red" ? "critical" : severity === "orange" ? "high" : "medium"}
      activeSince="now"
    >
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <Link
          href="/command-center"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to live incident
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <AlertOctagon className="h-5 w-5 text-destructive" />
          <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Declare a new incident
          </h1>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Brahmaputra Flood", type: "flood", severity: "red", location: "Dhemaji", radius: 150, brief: "Urgent flood alert in Dhemaji. Need boat operators and medical support." },
            { label: "Urban Fire", type: "fire", severity: "red", location: "Bengaluru", radius: 20, brief: "Massive fire reported in industrial area. Need logistics and search rescue teams." },
            { label: "Heatwave Alert", type: "heatwave", severity: "orange", location: "Nagpur", radius: 100, brief: "Severe heatwave. Need water distribution and first aid volunteers." },
            { label: "Medical Crisis", type: "medical", severity: "red", location: "Kolkata", radius: 50, brief: "Urgent medical staffing needed for camp. Need doctors and nurses." }
          ].map((template) => (
            <button
              key={template.label}
              onClick={() => {
                setType(template.type as IncidentType);
                setSeverity(template.severity as Severity);
                setLocation(template.location);
                setRadius(template.radius);
                setBrief(template.brief);
                runParse();
              }}
              className="flex flex-col items-start rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/50 hover:shadow-md"
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Template</div>
              <div className="mt-1 font-medium text-sm">{template.label}</div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-primary">
                One-click setup <ArrowLeft className="h-2.5 w-2.5 rotate-180" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Left: composer */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-5">
              <Label htmlFor="brief" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Situation brief
              </Label>
              <Textarea
                id="brief"
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={`e.g. Flood alert in Dhemaji district, Assam. Brahmaputra breached embankment near Silapathar. Need boat operators, medical teams, and Assamese translators within 180 km. Severity red.`}
                rows={7}
                className="mt-2 text-base leading-relaxed"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Any Indian language works. Avoid names of individuals.
                </p>
                <Button
                  onClick={runParse}
                  disabled={!brief.trim() || state === "parsing"}
                  size="sm"
                >
                  {state === "parsing" ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Parsing…
                    </>
                  ) : state === "ready" ? (
                    "Re-parse"
                  ) : (
                    "Parse with Gemini"
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Incident type
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {types.map((t) => {
                  const Icon = t.icon
                  const active = type === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs transition",
                        active
                          ? "border-primary/40 bg-primary/5 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Severity
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["yellow", "orange", "red"] as Severity[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium uppercase tracking-wide transition",
                      severity === s
                        ? s === "red"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : s === "orange"
                            ? "border-accent/40 bg-accent/10 text-accent-foreground"
                            : "border-yellow-500/40 bg-yellow-500/10 text-yellow-700"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Skills needed
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skillCatalog.map((s) => {
                  const active = selectedSkills.has(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition",
                        active
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: structured preview + dispatch */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Structured preview
                  </p>
                  <p className="text-sm text-foreground">
                    Ready to dispatch when you are
                  </p>
                </div>
                {state === "ready" && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                    parsed
                  </span>
                )}
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <Label htmlFor="title" className="text-xs text-muted-foreground">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dhemaji district · Brahmaputra flood"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="loc" className="text-xs text-muted-foreground">
                    Epicenter
                  </Label>
                  <Input
                    id="loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="District or town"
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Search radius
                  </Label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={10}
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[color:var(--primary)]"
                      aria-label="Search radius in kilometres"
                    />
                    <span className="w-16 text-right font-mono text-sm tabular-nums text-foreground">
                      {radius} km
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Est. reach from Vertex AI Vector Search
                  </p>
                  <ul className="mt-1.5 space-y-0.5 font-mono text-[11px]">
                    <li>
                      Candidates in radius:{" "}
                      <span className="text-foreground">
                        ~{(radius * 68).toLocaleString("en-IN")}
                      </span>
                    </li>
                    <li>
                      Skill-matched (top-K):{" "}
                      <span className="text-foreground">
                        ~{(selectedSkills.size * 380).toLocaleString("en-IN")}
                      </span>
                    </li>
                    <li>
                      Likely accept rate:{" "}
                      <span className="text-foreground">22%</span>
                    </li>
                  </ul>
                </div>

                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full"
                  onClick={dispatch}
                  disabled={dispatching || state !== "ready"}
                >
                  {dispatching ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Dispatching…
                    </>
                  ) : (
                    <>
                      <Megaphone className="mr-1.5 h-4 w-4" />
                      Dispatch mobilization
                    </>
                  )}
                </Button>
                {state !== "ready" && (
                  <p className="text-center text-xs text-muted-foreground">
                    Parse the brief first to enable dispatch.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              <p className="font-mono text-[11px] uppercase tracking-widest">
                Guardrails
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex gap-2">
                  <Droplet className="mt-0.5 h-3.5 w-3.5 text-primary" />
                  Every dispatch is logged to an immutable audit trail for the
                  State EOC.
                </li>
                <li className="flex gap-2">
                  <Droplet className="mt-0.5 h-3.5 w-3.5 text-primary" />
                  SevaSetu never mobilizes minors. DoB cross-check is automatic.
                </li>
                <li className="flex gap-2">
                  <Droplet className="mt-0.5 h-3.5 w-3.5 text-primary" />
                  An NDMA-format SITREP is auto-generated every 15 minutes.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CommandShell>
  )
}
