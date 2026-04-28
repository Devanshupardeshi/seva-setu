"use client"

import { useState } from "react"
import { MapPin, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onConfirm: () => void
}

const dayLabels: [string, string][] = [
  ["mon", "Mon"],
  ["tue", "Tue"],
  ["wed", "Wed"],
  ["thu", "Thu"],
  ["fri", "Fri"],
  ["sat", "Sat"],
  ["sun", "Sun"],
]

export function ProfileConfirm({ onConfirm }: Props) {
  const [name, setName] = useState("Priya Sharma")
  const [location, setLocation] = useState("Andheri West, Mumbai")
  const [skills, setSkills] = useState<string[]>([
    "Python",
    "Web design",
    "Teaching",
    "Math",
  ])
  const [newSkill, setNewSkill] = useState("")
  const [languages, setLanguages] = useState<string[]>([
    "Hindi",
    "English",
    "Marathi",
  ])
  const [days, setDays] = useState<Set<string>>(new Set(["sat", "sun"]))
  const [remote, setRemote] = useState(true)

  function toggleDay(d: string) {
    setDays((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })
  }

  function addSkill(e: React.FormEvent) {
    e.preventDefault()
    const s = newSkill.trim()
    if (!s) return
    setSkills((prev) => [...prev, s])
    setNewSkill("")
  }

  return (
    <div className="w-full max-w-2xl">
      <h2 className="font-serif text-3xl leading-tight tracking-tight">
        Does this look right?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit anything before we save your profile. You can always re-record.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <div>
          <label
            htmlFor="name"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            Location
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              via Places API
            </span>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Skills
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs"
              >
                {s}
                <button
                  type="button"
                  onClick={() =>
                    setSkills((prev) => prev.filter((p) => p !== s))
                  }
                  aria-label={`Remove ${s}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <form onSubmit={addSkill} className="inline-flex">
              <div className="flex items-center gap-1 rounded-full border border-dashed border-border bg-transparent px-2.5 py-1 text-xs">
                <Plus className="h-3 w-3 text-muted-foreground" />
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill"
                  className="w-24 bg-transparent outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Languages
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {languages.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs"
              >
                {l}
                <button
                  type="button"
                  onClick={() =>
                    setLanguages((prev) => prev.filter((p) => p !== l))
                  }
                  aria-label={`Remove ${l}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Available days
          </div>
          <div className="mt-2 flex gap-1.5">
            {dayLabels.map(([key, label]) => {
              const active = days.has(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDay(key)}
                  className={
                    "h-10 w-12 rounded-lg text-xs transition-colors " +
                    (active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground")
                  }
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4">
          <input
            type="checkbox"
            checked={remote}
            onChange={(e) => setRemote(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span>
            <span className="block text-sm">I'm open to remote help too</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Translation, tutoring, design work from home during the week.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button onClick={onConfirm}>Save profile</Button>
        <span className="text-xs text-muted-foreground">
          Your profile will be vector-embedded for semantic matching.
        </span>
      </div>
    </div>
  )
}
