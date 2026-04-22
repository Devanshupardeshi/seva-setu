import { CheckCircle2, MapPin, Truck, Users } from "lucide-react"

type Stat = {
  label: string
  value: number
  sub: string
  icon: React.ReactNode
  accent?: "primary" | "accent" | "destructive"
}

export function StatStrip({
  committed,
  enRoute,
  onSite,
  sectorsSecured,
  totalSectors,
}: {
  committed: number
  enRoute: number
  onSite: number
  sectorsSecured: number
  totalSectors: number
}) {
  const stats: Stat[] = [
    {
      label: "Committed",
      value: committed,
      sub: "Accepted the call",
      icon: <Users className="h-4 w-4" />,
      accent: "accent",
    },
    {
      label: "En route",
      value: enRoute,
      sub: "Moving to staging",
      icon: <Truck className="h-4 w-4" />,
      accent: "primary",
    },
    {
      label: "On-site",
      value: onSite,
      sub: "Checked in via QR",
      icon: <CheckCircle2 className="h-4 w-4" />,
      accent: "primary",
    },
    {
      label: "Sectors secured",
      value: sectorsSecured,
      sub: `of ${totalSectors} total`,
      icon: <MapPin className="h-4 w-4" />,
      accent: "primary",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </span>
            <span
              className={
                s.accent === "accent"
                  ? "text-accent"
                  : s.accent === "destructive"
                    ? "text-destructive"
                    : "text-primary"
              }
            >
              {s.icon}
            </span>
          </div>
          <div className="mt-3 font-serif text-3xl tabular-nums text-foreground">
            {s.value.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
