"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Building2, Check, Loader2, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/site/logo"
import { Label } from "@/components/ui/label"

export default function NgoRegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push("/ngo")
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f6f0]">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-serif text-xl leading-none tracking-tight">
              SevaSetu
            </span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Already registered? Sign in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-8 rounded-[2.5rem] border border-border bg-background p-8 shadow-2xl md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 text-primary">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-4xl tracking-tight">Onboard your Organization</h1>
            <p className="mt-2 text-muted-foreground">
              Connect your NGO to the SevaSetu resource network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ngo-name">NGO Name</Label>
                <Input id="ngo-name" placeholder="Legal name as per registration" required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="darpan-id">NGO Darpan ID</Label>
                <div className="relative">
                  <Input id="darpan-id" placeholder="AB/2024/123456" required className="rounded-xl pr-10" />
                  <Shield className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Verified via NGO Darpan Portal</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Headquarters Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="location" placeholder="City, State" required className="pl-10 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus">Primary Focus Area</Label>
              <select id="focus" className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option>Disaster Response</option>
                <option>Education & Literacy</option>
                <option>Health & Family Welfare</option>
                <option>Environment & Forests</option>
                <option>Rural Development</option>
              </select>
            </div>

            <div className="rounded-2xl bg-muted/50 p-6 space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Coordinator Details
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="coord-name" className="text-xs">Full Name</Label>
                  <Input id="coord-name" placeholder="Authorized Person" required className="rounded-lg h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coord-phone" className="text-xs">Mobile Number</Label>
                  <Input id="coord-phone" type="tel" placeholder="+91 XXXXX XXXXX" required className="rounded-lg h-9 text-sm" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Complete NGO Onboarding
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              FCRA Compatible
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              CSR Reporting Ready
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
