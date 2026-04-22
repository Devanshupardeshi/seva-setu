"use client"

import { useEffect, useState } from "react"
import { Check, Sparkles } from "lucide-react"

type Field =
  | { key: "name"; label: string; value: string }
  | { key: "skills"; label: string; values: string[] }
  | { key: "languages"; label: string; values: string[] }
  | { key: "availability"; label: string; values: string[] }
  | { key: "location"; label: string; value: string }
  | { key: "experience"; label: string; value: string }

export function ExtractionStream({ onDone, data }: { onDone: (data: any) => void; data?: any }) {
  const [revealed, setRevealed] = useState(0)

  // Use the data prop if available, else fallback to mock data
  const fields: Field[] = data ? [
    { key: "name", label: "Name", value: data.name },
    { key: "skills", label: "Skills", values: data.skills || [] },
    { key: "languages", label: "Languages", values: data.languages || [] },
    { key: "availability", label: "Availability", values: data.availability || [] },
    { key: "location", label: "Location", value: data.location || "Andheri West, Mumbai" },
    { key: "experience", label: "Experience", value: data.experience || "Student" },
  ] : [
    { key: "name", label: "Name", value: "Priya" },
    {
      key: "skills",
      label: "Skills",
      values: ["Python", "Web design", "Teaching", "Math"],
    },
    {
      key: "languages",
      label: "Languages",
      values: ["Hindi", "English", "Marathi"],
    },
    { key: "availability", label: "Availability", values: ["Saturdays", "Sundays"] },
    { key: "location", label: "Location", value: "Andheri West, Mumbai" },
    { key: "experience", label: "Experience", value: "Student, 3rd-year engineering" },
  ]

  useEffect(() => {
    if (revealed >= fields.length) {
      const t = setTimeout(() => onDone(data), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), 650)
    return () => clearTimeout(t)
  }, [revealed, onDone, fields.length, data])

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Gemini 2.5 Pro · extracting structured profile
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {fields.map((f, i) => {
          const isRevealed = i < revealed
          return (
            <div
              key={f.key}
              className={
                "flex items-start justify-between gap-4 rounded-xl border px-4 py-3 transition-all duration-500 " +
                (isRevealed
                  ? "translate-y-0 border-border bg-card opacity-100"
                  : "translate-y-1 border-dashed border-border/60 bg-transparent opacity-40")
              }
            >
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </div>
                <div className="mt-1 text-sm">
                  {"value" in f ? (
                    isRevealed ? (
                      f.value
                    ) : (
                      <span className="text-muted-foreground">Analysing…</span>
                    )
                  ) : isRevealed ? (
                    <div className="flex flex-wrap gap-1.5">
                      {f.values.map((v) => (
                        <span
                          key={v}
                          className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Analysing…</span>
                  )}
                </div>
              </div>
              <div
                className={
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
                  (isRevealed ? "bg-primary text-primary-foreground" : "bg-muted")
                }
              >
                {isRevealed && <Check className="h-3 w-3" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
