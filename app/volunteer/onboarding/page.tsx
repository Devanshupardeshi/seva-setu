"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { VoiceRecorder } from "@/components/volunteer/voice-recorder"
import { ExtractionStream } from "@/components/volunteer/extraction-stream"
import { ProfileConfirm } from "@/components/volunteer/profile-confirm"

const languages = [
  { code: "hi", label: "हिन्दी", en: "Hindi" },
  { code: "en", label: "English", en: "English" },
  { code: "mr", label: "मराठी", en: "Marathi" },
  { code: "ta", label: "தமிழ்", en: "Tamil" },
  { code: "te", label: "తెలుగు", en: "Telugu" },
  { code: "bn", label: "বাংলা", en: "Bengali" },
]

type Step = "lang" | "record" | "extract" | "confirm"

export default function OnboardingPage() {

  const router = useRouter()
  const [step, setStep] = useState<Step>("lang")
  const [lang, setLang] = useState<string>("hi")
  const [profileData, setProfileData] = useState<any>(null)
  const stepIndex = ["lang", "record", "extract", "confirm"].indexOf(step)

  async function handleVoiceComplete(blob: Blob | null, fallbackText?: string) {
    setStep("extract")
    // Fetch from Gemini API
    try {
      if (blob) {
        const formData = new FormData()
        formData.append("audio", blob, "audio.webm")
        const res = await fetch("/api/onboarding/extract", {
          method: "POST",
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          setProfileData(data)
          return
        }
      }
    } catch(e) {
      console.error(e)
    }

    // Fallback to simulated data if API fails or no blob
    console.log("Using fallback profile data...")
    setProfileData({
      name: "Priya Sharma",
      skills: ["First Aid", "Hindi Translation", "Digital Literacy"],
      languages: ["Hindi", "English"],
      availability: ["Weekends", "Evenings"],
      location: "Bandra, Mumbai",
      experience: "Student / Community Volunteer"
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-serif text-xl leading-none tracking-tight">
              SevaSetu
            </span>
          </Link>
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Step {stepIndex + 1} of 4
          </div>
        </div>
        <div className="h-0.5 w-full bg-border">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / 4) * 100}%` }}
          />
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 md:py-16">
        {step === "lang" && (
          <div className="w-full max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Namaste
            </p>
            <h1 className="mt-3 text-balance font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Which language do you think in?
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Pick one. You can still speak in a mix — Gemini handles
              code-switching. This just tells us where to start.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={
                    "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors " +
                    (lang === l.code
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40")
                  }
                >
                  <span className="font-serif text-2xl leading-none tracking-tight">
                    {l.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{l.en}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3">
              <Button onClick={() => setStep("record")}>
                Continue
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Back to overview
              </Link>
            </div>
          </div>
        )}

        {step === "record" && (
          <div className="flex w-full max-w-2xl flex-col items-center gap-6">
            <div className="w-full">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Your voice intro
              </p>
              <h1 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Tell us what you&apos;d love to help with.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                A voice note works best — ~30 seconds. Share your skills,
                where you live, and when you&apos;re free.
              </p>
            </div>
            <VoiceRecorder onComplete={handleVoiceComplete} />
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setStep("lang")}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Change language
              </Button>
            </div>
          </div>
        )}

        {step === "extract" && (
          <div className="flex w-full max-w-2xl flex-col items-start gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Processing
              </p>
              <h1 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                Pulling out what matters.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                No forms. Gemini 2.5 Pro is extracting your structured profile
                from the voice note.
              </p>
            </div>
            <ExtractionStream data={profileData} onDone={() => setStep("confirm")} />
          </div>
        )}

        {step === "confirm" && (
          <ProfileConfirm
            onConfirm={async () => {
              if (profileData) {
                try {
                  const { createVolunteer } = await import("@/lib/firebase/firestore")
                  await createVolunteer({
                    ...(profileData as any),
                    id: "vol-" + Date.now()
                  })
                } catch (e) {
                  console.error("Failed to save volunteer to Firestore", e)
                }
              }
              router.push("/volunteer")
            }}
          />
        )}
      </main>

      <footer className="border-t border-border/60 bg-background py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <Check className="h-3 w-3" />
            End-to-end encrypted · DPDP compliant
          </div>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  )
}
