import { Fingerprint, MapPin, QrCode } from "lucide-react"
import { ledger, type LedgerRow } from "@/lib/mock-impact-data"

function VerifiedBadge({ method }: { method: LedgerRow["verified"] }) {
  const cfg =
    method === "qr"
      ? { Icon: QrCode, label: "QR check-in" }
      : method === "geofence"
        ? { Icon: MapPin, label: "Geofence" }
        : { Icon: Fingerprint, label: "Signature" }
  const Icon = cfg.Icon
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  )
}

export function LedgerTable() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Verified hours ledger
            </p>
            <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              Every hour,
              <span className="italic text-primary"> on the record.</span>
            </h2>
          </div>
          <p className="max-w-md text-pretty text-sm text-muted-foreground">
            A read-only projection of the BigQuery table{" "}
            <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs text-foreground">
              sevasetu.impact.ledger
            </code>
            . Each row is signed by the NGO and the volunteer.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Last 8 entries · 12 841 total
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Streaming
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-border bg-card">
                <tr className="text-left font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Tx ID</th>
                  <th className="px-5 py-3 font-medium">Timestamp (IST)</th>
                  <th className="px-5 py-3 font-medium">Volunteer</th>
                  <th className="px-5 py-3 font-medium">NGO</th>
                  <th className="px-5 py-3 font-medium">SDG</th>
                  <th className="px-5 py-3 text-right font-medium">Hours</th>
                  <th className="px-5 py-3 font-medium">Verified via</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledger.map((r) => (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {r.id}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground tabular-nums">
                      {r.ts}
                    </td>
                    <td className="px-5 py-4 text-foreground">{r.volunteer}</td>
                    <td className="px-5 py-4 text-foreground">{r.ngo}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-md font-serif text-sm ${
                          r.sdg === "11"
                            ? "bg-accent/15 text-accent"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {r.sdg}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-serif text-lg text-foreground tabular-nums">
                      {r.hours}
                    </td>
                    <td className="px-5 py-4">
                      <VerifiedBadge method={r.verified} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
