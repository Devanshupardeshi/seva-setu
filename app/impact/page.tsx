import { SiteNav } from "@/components/site/nav"
import { SiteFooter } from "@/components/site/footer"
import { CtaBand } from "@/components/site/cta-band"
import { ImpactHero } from "@/components/impact/impact-hero"
import { SdgGauges } from "@/components/impact/sdg-gauges"
import { IndiaHeatmap } from "@/components/impact/india-heatmap"
import { TrendChart } from "@/components/impact/trend-chart"
import { LiveFeed } from "@/components/impact/live-feed"
import { PartnerMarquee } from "@/components/impact/partner-marquee"
import { LedgerTable } from "@/components/impact/ledger-table"
import { JudgingStrip } from "@/components/impact/judging-strip"

export const metadata = {
  title: "Impact ledger · SevaSetu",
  description:
    "A public, BigQuery-backed record of every verified volunteer hour delivered through SevaSetu — SDG-aligned, district-mapped, and fully auditable.",
}

export default function ImpactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <ImpactHero />
        <SdgGauges />
        <IndiaHeatmap />
        <TrendChart />
        <LiveFeed />
        <PartnerMarquee />
        <LedgerTable />
        <JudgingStrip />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  )
}
