"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/site/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"volunteer" | "ngo">("volunteer")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate login
    setTimeout(() => {
      // Set session cookies that expire in 1 day
      document.cookie = "session=true; path=/; max-age=86400; SameSite=Lax"
      document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`
      router.push(role === "volunteer" ? "/volunteer" : "/ngo")
      router.refresh()
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f6f0] px-4">
      <Link 
        href="/" 
        className="absolute left-6 top-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>

      <div className="w-full max-w-md space-y-8 rounded-[2.5rem] border border-border bg-background p-8 shadow-2xl md:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <Logo className="h-10 w-10" />
          </div>
          <h1 className="font-serif text-3xl tracking-tight">SevaSetu Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="volunteer" onValueChange={(v) => setRole(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 bg-muted/50 p-1">
              <TabsTrigger value="volunteer" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <User className="mr-2 h-4 w-4" />
                Volunteer
              </TabsTrigger>
              <TabsTrigger value="ngo" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Building2 className="mr-2 h-4 w-4" />
                NGO
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder={role === "volunteer" ? "Volunteer email" : "Organization email"}
                  required 
                  className="h-12 pl-10 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className="h-12 pl-10 rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-primary font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In to {role === "volunteer" ? "Volunteer Hub" : "NGO Console"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
          {role === "volunteer" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => router.push("/volunteer/onboarding")}
                className="text-primary font-medium hover:underline focus:outline-none"
              >
                Register as a volunteer
              </button>
            </p>
          ) : (
            <p>
              Organization not registered?{" "}
              <button 
                onClick={() => router.push("/ngo/register")}
                className="text-primary font-medium hover:underline focus:outline-none"
              >
                Onboard your NGO
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/50">
        <span>Security</span>
        <span>•</span>
        <span>NGO Darpan Sync</span>
        <span>•</span>
        <span>Help</span>
      </div>
    </div>
  )
}
