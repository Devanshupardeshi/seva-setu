import { SiteNav } from "@/components/site/nav"
import { SiteFooter } from "@/components/site/footer"
import { Hero } from "@/components/site/hero"
import { Scenarios } from "@/components/site/scenarios"
import { HowItWorks } from "@/components/site/how-it-works"
import { DisasterPreview } from "@/components/site/disaster-preview"
import { FeaturesGrid } from "@/components/site/features-grid"
import { SdgSection } from "@/components/site/sdg-section"
import { ImpactStats } from "@/components/site/impact-stats"
import { TechStack } from "@/components/site/tech-stack"
import { CtaBand } from "@/components/site/cta-band"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main>
        <Hero />
        <Scenarios />
        <HowItWorks />
        <DisasterPreview />
        <FeaturesGrid />
        <SdgSection />
        <ImpactStats />
        <TechStack />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  )
}
