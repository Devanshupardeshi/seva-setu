import { NgoShell } from "@/components/app-shell/ngo-shell"
import { PostComposer } from "@/components/ngo/post-composer"
import {
  currentCoordinator,
  currentNgo,
} from "@/lib/mock-ngo-data"

export default function NgoPostPage() {
  return (
    <NgoShell
      ngoName={currentNgo.name}
      darpanId={currentNgo.darpanId}
      coordinatorName={currentCoordinator.name}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-10 max-w-2xl">
          <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Post a need
          </div>
          <h1 className="mt-1 text-balance font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Describe in one sentence. We do the rest.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Gemini parses your request into a structured need, embeds it as a
            vector, and starts ranking matched volunteers within seconds.
          </p>
        </div>

        <PostComposer />
      </div>
    </NgoShell>
  )
}
