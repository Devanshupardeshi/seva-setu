import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  title: string
  session: string
  description: string
  bullets: string[]
}

export function ComingSoon({ title, session, description, bullets }: Props) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-start justify-center gap-8 px-4 py-20 md:px-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {session}
        </p>
        <h1 className="mt-4 text-balance font-serif text-5xl leading-tight tracking-tight text-foreground md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <ul className="flex flex-col gap-3 border-l-2 border-border pl-5 text-sm text-foreground">
        {bullets.map((b) => (
          <li key={b} className="leading-relaxed">
            {b}
          </li>
        ))}
      </ul>

      <Button asChild variant="outline">
        <Link href="/">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to overview
        </Link>
      </Button>
    </div>
  )
}
