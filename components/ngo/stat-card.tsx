import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  accent,
}: {
  label: string
  value: string | number
  helper?: string
  icon?: LucideIcon
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border p-5",
        accent
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon ? (
          <Icon
            className={cn(
              "h-4 w-4",
              accent ? "text-primary" : "text-muted-foreground",
            )}
          />
        ) : null}
      </div>
      <div className="mt-4">
        <div className="font-serif text-3xl tracking-tight">{value}</div>
        {helper ? (
          <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
        ) : null}
      </div>
    </div>
  )
}
