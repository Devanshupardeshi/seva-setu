"use client"

import Link from "next/link"
import { ArrowLeft, Mic, Sparkles, UserPlus, Heart, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/site/logo"

export default function VolunteerSignup() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfbf9]">
      <header className="px-6 py-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-2xl space-y-12">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-5xl tracking-tight leading-tight">Join the movement.</h1>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground">
              SevaSetu isn't like other platforms. No long forms. No data entry. 
              Just you, your voice, and the mission.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 mb-6">
                <Mic className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">Voice First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Speak in your mother tongue. Our AI extracts your skills, location, and availability automatically.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 mb-6">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">Smart Matches</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No endless scrolling. We only surface gigs that fit your skills and weekend schedule.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 mb-6">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">Crisis Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Be the first to know during a disaster. Mobilize in seconds when your community needs you most.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 mb-6">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-serif text-xl mb-2">Verified Impact</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get verifiable certificates for every task. Build your community service portfolio seamlessly.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
              asChild 
              size="lg" 
              className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-primary/20 transition-transform active:scale-95"
            >
              <Link href="/volunteer/onboarding">
                Start Voice Onboarding
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 py-8 border-t border-border/40">
        <div className="mx-auto max-w-4xl flex items-center justify-center gap-2 opacity-40 grayscale">
          <Logo className="h-5 w-5" />
          <span className="font-serif text-sm">SevaSetu</span>
        </div>
      </footer>
    </div>
  )
}
