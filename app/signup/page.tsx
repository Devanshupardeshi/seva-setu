"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/site/logo"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signUpWithEmail } from "@/frontend/lib/auth/client"
import { isFirebaseConfigured } from "@/lib/firebase/client"
import { toast } from "sonner"

function SignupForm() {
  const search = useSearchParams()
  const initialRole =
    search.get("role") === "ngo" ? ("ngo" as const) : ("volunteer" as const)

  const [role, setRole] = useState<"volunteer" | "ngo">(initialRole)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const firebaseReady = isFirebaseConfigured()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!firebaseReady) {
      setError(
        "Authentication is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* env vars in Vercel and redeploy.",
      )
      return
    }

    setLoading(true)
    const result = await signUpWithEmail({
      email: email.trim(),
      password,
      role,
      displayName: name.trim(),
    })
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    toast.success("Account created", {
      description: "Welcome to SevaSetu.",
    })
    router.push(result.role === "volunteer" ? "/volunteer" : "/ngo")
    router.refresh()
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-[2.5rem] border border-border bg-background p-8 shadow-2xl md:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Logo className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-3xl tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your role and we&apos;ll set up the right workspace.
        </p>
      </div>

      {!firebaseReady && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Firebase is not configured. Add{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 text-[11px]">
              NEXT_PUBLIC_FIREBASE_*
            </code>{" "}
            env vars in Vercel and redeploy.
          </p>
        </div>
      )}

      <Tabs
        value={role}
        onValueChange={(v) => setRole(v as "volunteer" | "ngo")}
        className="w-full"
      >
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-muted/50 p-1">
          <TabsTrigger
            value="volunteer"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <User className="mr-2 h-4 w-4" />
            Volunteer
          </TabsTrigger>
          <TabsTrigger
            value="ngo"
            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Building2 className="mr-2 h-4 w-4" />
            NGO
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === "volunteer" ? "Full name" : "Organisation name"}
            required
            className="h-12 rounded-xl border-muted bg-muted/30 pl-10 focus:bg-background"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="h-12 rounded-xl border-muted bg-muted/30 pl-10 focus:bg-background"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min. 8 chars)"
            required
            minLength={8}
            className="h-12 rounded-xl border-muted bg-muted/30 pl-10 focus:bg-background"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !firebaseReady}
          className="h-12 w-full rounded-xl text-base shadow-lg shadow-primary/20"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create {role === "volunteer" ? "Volunteer" : "NGO"} account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="border-t border-border/50 pt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f6f0] px-4 py-10">
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site
      </Link>
      <Suspense
        fallback={
          <div className="rounded-3xl border border-border bg-background p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </div>
  )
}
