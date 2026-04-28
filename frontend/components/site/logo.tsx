import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      {/* Two nodes bridged by a curve — the "setu" (bridge) */}
      <circle cx="6" cy="22" r="3" fill="currentColor" />
      <circle cx="26" cy="10" r="3" fill="currentColor" />
      <path
        d="M6 22 C 12 22, 14 10, 26 10"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
      />
      {/* accent warmth dot — urgency/Indian warmth */}
      <circle cx="16" cy="16" r="2" fill="var(--accent)" />
    </svg>
  )
}
