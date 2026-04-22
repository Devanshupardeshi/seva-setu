"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Responder } from "@/lib/mock-incident-data"
import { cn } from "@/lib/utils"

const statuses = [
  { value: "all", label: "All" },
  { value: "on-site", label: "On-site" },
  { value: "en-route", label: "En route" },
  { value: "committed", label: "Committed" },
] as const

type StatusFilter = (typeof statuses)[number]["value"]

const statusBadge: Record<Responder["status"], string> = {
  "on-site": "bg-primary/10 text-primary border-primary/30",
  "en-route": "bg-primary/5 text-primary border-primary/20",
  committed: "bg-accent/15 text-accent border-accent/30",
}

export function ResponderList({ responders }: { responders: Responder[] }) {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return responders.filter((r) => {
      if (status !== "all" && r.status !== status) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) || r.skill.toLowerCase().includes(q)
      )
    })
  }, [responders, status, query])

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Responder roster
          </p>
          <p className="text-sm text-foreground">
            {filtered.length} of {responders.length} people
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or skill"
              className="h-8 w-44 pl-7 text-xs"
            />
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1">
            {statuses.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest transition",
                  status === s.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="max-h-[28rem] divide-y divide-border overflow-y-auto">
        {filtered.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between px-4 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-foreground">
                {r.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{r.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {r.skill}
                  {r.sector && (
                    <span className="ml-1 font-mono text-[10px] uppercase tracking-widest">
                      · {r.sector.toUpperCase()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {r.etaMin && (
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  ETA {r.etaMin}m
                </span>
              )}
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                  statusBadge[r.status],
                )}
              >
                {r.status === "on-site"
                  ? "on-site"
                  : r.status === "en-route"
                    ? "en route"
                    : "committed"}
              </span>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">
            No responders match this filter.
          </li>
        )}
      </ul>
    </div>
  )
}
