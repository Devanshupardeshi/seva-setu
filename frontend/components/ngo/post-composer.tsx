"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import {
  Calendar,
  Check,
  Clock,
  Loader2,
  MapPin,
  Send,
  Sparkles,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Parsed = {
  title: string
  skills: string[]
  languages: string[]
  date: string
  time: string
  duration: string
  location: string
  urgency: "routine" | "priority" | "critical"
  slots: number
  summary: string
}

const examples = [
  "Need someone to teach 10 kids basic computers this Saturday, 3-5 PM, in our Bandra center.",
  "Looking for a graphic designer to make 3 Instagram posts for our annual day. Remote, by next Wednesday.",
  "Urgent: two doctors to volunteer at Sunday health camp in Dharavi, 9 AM onwards, 4 hours.",
]


export function PostComposer() {
  const router = useRouter()
  const [text, setText] = useState("")
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState<Parsed | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const canParse = useMemo(() => text.trim().length >= 20, [text])

  async function handleParse() {
    if (!canParse) return
    setParsing(true)
    setParsed(null)
    try {
      const res = await fetch("/api/needs/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: text }),
      })
      if (!res.ok) throw new Error("Failed to parse")
      const result = await res.json()
      setParsed(result)
    } catch (e) {
      console.error(e)
    } finally {
      setParsing(false)
    }
  }

  async function handlePublish() {
    if (!parsed) return
    setPublishing(true)
    try {
      const { createNeed } = await import("@/lib/firebase/firestore")
      const { currentNgo } = await import("@/lib/mock-ngo-data")
      await createNeed({
        id: "need-" + Date.now(),
        ngoId: currentNgo.id,
        ngoName: currentNgo.name,
        ...(parsed as any),
        createdAt: new Date().toISOString(),
      })
    } catch (e) {
      console.error("Failed to save need", e)
    }
    setPublishing(false)
    setPublished(true)
    await new Promise((r) => setTimeout(r, 700))
    router.push("/ngo")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="flex flex-col gap-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Step 1 · describe in plain words
          </div>
          <h2 className="mt-1 font-serif text-2xl leading-tight tracking-tight">
            What do you need help with this week?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Type a sentence. Hindi, Marathi or English all work. Gemini will
            extract skills, time and location automatically.
          </p>
        </div>

        <Textarea
          placeholder="Need someone to teach 10 kids basic computers this Saturday, 3-5 PM, in our Bandra center."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="resize-none rounded-2xl border-border bg-card text-base leading-relaxed"
        />

        <div className="flex flex-wrap gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Try:
          </span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setText(ex)}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {ex.slice(0, 48)}…
            </button>
          ))}
        </div>

        <Button
          onClick={handleParse}
          disabled={!canParse || parsing}
          size="lg"
          className="w-full sm:w-auto"
        >
          {parsing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gemini is extracting…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Extract structured need
            </>
          )}
        </Button>
      </section>

      <section
        className={cn(
          "flex min-h-[520px] flex-col rounded-3xl border p-6 transition-colors",
          parsed
            ? "border-primary/30 bg-primary/5"
            : "border-dashed border-border bg-secondary/40",
        )}
      >
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Step 2 · review structured preview
        </div>
        {parsed ? (
          <div className="mt-4 flex flex-1 flex-col gap-5">
            <div>
              <h3 className="font-serif text-2xl leading-tight tracking-tight">
                {parsed.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {parsed.summary}
              </p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <ParsedRow icon={Calendar} label="When">
                {parsed.date} · {parsed.time}
              </ParsedRow>
              <ParsedRow icon={Clock} label="Duration">
                {parsed.duration}
              </ParsedRow>
              <ParsedRow icon={MapPin} label="Where">
                {parsed.location}
              </ParsedRow>
              <ParsedRow icon={Tag} label="Urgency">
                <span className="capitalize">{parsed.urgency}</span> · {parsed.slots}{" "}
                slot{parsed.slots > 1 ? "s" : ""}
              </ParsedRow>
            </dl>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Skills required
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {parsed.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-background px-2.5 py-0.5 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Languages preferred
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {parsed.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-background px-2.5 py-0.5 text-xs"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
              <Button
                onClick={handlePublish}
                disabled={publishing || published}
                className="flex-1 sm:flex-none"
              >
                {published ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Published · matching volunteers now
                  </>
                ) : publishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Publish &amp; match
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={publishing || published}>
                Save as draft
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your parsed need preview will appear here. You can edit anything
              before publishing.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

function ParsedRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-background/80 p-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}
