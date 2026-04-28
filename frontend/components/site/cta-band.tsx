import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-primary px-6 py-16 text-primary-foreground md:px-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--accent) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--background) 0%, transparent 50%)",
          }}
        />
        <div className="relative grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
              Join the pilot
            </p>
            <h2 className="mt-3 text-balance font-serif text-4xl leading-tight md:text-6xl">
              Every hour waiting is an hour someone
              <span className="italic"> needed help.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="text-pretty text-primary-foreground/80">
              If you&apos;re a volunteer, an NGO, a district collector, or a
              CSR team — we want to onboard you this month.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link href="/volunteer">
                  Start as a volunteer
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/ngo">Register your NGO</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
