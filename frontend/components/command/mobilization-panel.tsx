"use client"

import { useState } from "react"
import { MessageSquare, Phone, Send, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/frontend/lib/mode/api-client"

const channels = [
  { id: "push", label: "FCM push", icon: Smartphone, default: true },
  { id: "sms", label: "SMS", icon: MessageSquare, default: true },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, default: true },
  { id: "voice", label: "Voice call", icon: Phone, default: false },
]

export function MobilizationPanel({ incidentId }: { incidentId: string }) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(channels.filter((c) => c.default).map((c) => c.id)),
  )
  const [radius, setRadius] = useState(180)
  const [sent, setSent] = useState(false)

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Mobilize more
        </p>
        <p className="text-sm text-foreground">
          Expand reach to close remaining gaps
        </p>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Search radius
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={50}
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

        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Channels
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {channels.map((c) => {
              const Icon = c.icon
              const active = selected.has(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                    active
                      ? "border-primary/40 bg-primary/5 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
          Estimated reach: <span className="text-foreground">~{(radius * 38).toLocaleString("en-IN")}</span> matched volunteers via{" "}
          <span className="text-foreground">{selected.size}</span> channels.
        </div>

        <Button
          size="lg"
          variant="destructive"
          className="w-full"
          onClick={async () => {
            setSent(true)
            try {
              await apiFetch("/api/mobilize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  incidentId: incidentId,
                  volunteerIds: ["v_priya", "v_arjun", "v_sara", "v_rohan"], // dynamic list from matching engine
                  messageTemplate: `Urgent: Additional assistance needed at ${incidentId}. Please open SevaSetu app to coordinate.`,
                }),
              })
            } catch (err) {
              console.error("Mobilization error", err)
            }
          }}
          disabled={sent}
        >
          <Send className="mr-1.5 h-4 w-4" />
          {sent ? "Mobilization dispatched" : "Dispatch mobilization"}
        </Button>
      </div>
    </div>
  )
}
