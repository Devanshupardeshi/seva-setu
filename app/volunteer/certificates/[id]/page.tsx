"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CertificateCard } from "@/components/volunteer/certificate-card"
import { VolunteerShell } from "@/components/app-shell/volunteer-shell"
import { currentVolunteer } from "@/lib/mock-data"

export default function CertificatePage() {
  const { id } = useParams()
  const router = useRouter()
  
  // In a real app, fetch based on id. Using mock for now.
  const certificateData = {
    volunteerName: currentVolunteer.name,
    ngoName: "Hope Foundation",
    taskTitle: "Weekend Teaching Support",
    date: "April 25, 2026",
    hours: 4,
    certificateId: `SS-${id?.toString().toUpperCase() || 'TMP'}-2026`
  }

  return (
    <VolunteerShell
      userName={currentVolunteer.name}
      userLocation={currentVolunteer.location.label}
    >
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8 gap-2 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Impact
        </Button>
        
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <CertificateCard {...certificateData} />
          </div>
          
          <aside className="w-full lg:w-64">
            <div className="sticky top-24 space-y-4">
              <h3 className="font-serif text-2xl tracking-tight">Your Achievement</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This certificate is a verified record of your contribution. You can download it as a PDF or share it directly to your professional networks.
              </p>
              
              <div className="grid gap-3 pt-4">
                <Button className="w-full gap-2" onClick={() => window.print()}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share to LinkedIn
                </Button>
              </div>
              
              <div className="mt-8 rounded-xl border border-border bg-primary/5 p-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-primary">Pro Tip</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Adding volunteer experience to your LinkedIn profile increases views by up to **6x**.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </VolunteerShell>
  )
}
