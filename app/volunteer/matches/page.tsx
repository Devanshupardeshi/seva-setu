"use client"

import Link from "next/link"
import { ArrowRight, Calendar, MapPin, Shield } from "lucide-react"
import { VolunteerShell } from "@/components/app-shell/volunteer-shell"
import { currentVolunteer, activeIncident } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MatchesPage() {
  // In a real app, we would fetch incidents where the volunteer is assigned
  // For now, we'll show the active drills/incidents
  const activeMatches = [activeIncident]

  return (
    <VolunteerShell
      userName={currentVolunteer.name}
      userLocation={currentVolunteer.location.label}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-serif text-4xl tracking-tight">Active Matches</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              You have been matched with {activeMatches.length} urgent mobilizations.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeMatches.map((incident) => (
            <div 
              key={incident.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="relative aspect-[16/9] w-full bg-muted">
                <img 
                  src={incident.type === "flood" ? "https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=800&auto=format&fit=crop" : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"} 
                  alt={incident.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute left-4 top-4 bg-destructive text-destructive-foreground">
                  URGENT
                </Badge>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">
                    Mobilization Active
                  </p>
                  <h3 className="font-serif text-xl text-white">{incident.title}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-xs text-muted-foreground">
                        {(incident as any).epicenter?.label || (incident as any).location?.label}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Your Role</p>
                      <p className="text-xs text-muted-foreground">Emergency Responder</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Started</p>
                      <p className="text-xs text-muted-foreground">42 minutes ago</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <Button asChild className="flex-1 rounded-xl">
                    <Link href={`/volunteer/matches/${incident.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeMatches.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Shield className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="mt-6 font-serif text-2xl">No active matches</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              When a disaster occurs in your region and matches your skills, 
              it will appear here instantly.
            </p>
          </div>
        )}
      </div>
    </VolunteerShell>
  )
}
