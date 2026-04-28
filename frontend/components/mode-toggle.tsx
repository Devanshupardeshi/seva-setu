"use client"

import * as React from "react"
import { Sparkles, Zap } from "lucide-react"
import { useAppMode } from "@/frontend/lib/mode/mode-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

/**
 * Demo / Actual mode toggle.
 *
 * Demo Mode   → all server routes return mock data (no Firebase / Gemini calls).
 *               Safe for reviewers exploring the public deployment.
 * Actual Mode → live backend with Firebase Admin, Gemini 2.5 Flash and
 *               Vertex AI Vector Search. Requires the project env vars.
 */
export function ModeToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { mode, setMode, hydrated } = useAppMode()

  const onChange = (next: "demo" | "actual") => {
    if (next === mode) return
    setMode(next)
    if (next === "actual") {
      toast.success("Actual Mode activated", {
        description: "API routes now call live Firebase, Gemini and Vertex AI services.",
      })
    } else {
      toast.message("Demo Mode activated", {
        description: "Showing mock data — no external services are contacted.",
      })
    }
  }

  // Render a stable shell on the server so hydration matches.
  const isActual = hydrated && mode === "actual"

  if (compact) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isActual}
        aria-label={`Switch to ${isActual ? "Demo" : "Actual"} Mode`}
        onClick={() => onChange(isActual ? "demo" : "actual")}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium uppercase tracking-wide transition-colors",
          isActual
            ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
            : "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
          className,
        )}
      >
        {isActual ? <Zap className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        <span>{isActual ? "Actual" : "Demo"}</span>
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label="App mode"
      className={cn(
        "inline-flex h-9 items-center rounded-full border border-border bg-muted/30 p-1",
        className,
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isActual}
        onClick={() => onChange("demo")}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
          !isActual
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Demo
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={isActual}
        onClick={() => onChange("actual")}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
          isActual
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Zap className="h-3.5 w-3.5" />
        Actual
      </button>
    </div>
  )
}

export default ModeToggle
