import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/**
 * Standard empty-state card used when Actual Mode collections are empty
 * (e.g. no needs posted yet, no incidents active).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-serif text-lg tracking-tight">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
