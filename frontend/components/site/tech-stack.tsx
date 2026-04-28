const tiers = [
  {
    tier: "AI",
    items: [
      {
        name: "Gemini 2.5 Pro",
        use: "Need parsing, briefing generation, CSR report drafting",
      },
      {
        name: "Vertex AI Vector Search",
        use: "Sub-second semantic skill matching",
      },
      {
        name: "Vertex AI Embeddings",
        use: "text-embedding-004 for volunteers & needs",
      },
    ],
  },
  {
    tier: "Backend & Data",
    items: [
      {
        name: "Firebase Firestore",
        use: "Operational database with real-time sync",
      },
      {
        name: "Firebase Authentication",
        use: "Email/password today, Phone OTP planned",
      },
      {
        name: "Firebase Cloud Messaging",
        use: "Web push notifications to volunteers",
      },
      {
        name: "Next.js Route Handlers",
        use: "Server-rendered APIs on Vercel Edge",
      },
    ],
  },
  {
    tier: "Frontend",
    items: [
      {
        name: "Next.js 16 + React 19",
        use: "App Router, server components, streaming",
      },
      {
        name: "shadcn/ui + Tailwind v4",
        use: "Accessible component system",
      },
      {
        name: "Google Maps Platform",
        use: "Live geofences, routes, command-center map",
      },
      {
        name: "html5-qrcode",
        use: "QR check-in / check-out at site",
      },
    ],
  },
]

export function TechStack() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            What is actually shipping
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            A focused stack.
            <span className="italic text-primary"> No vapor.</span>
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Every service listed below is wired, deployed, and exercised by the
            live demo. Nothing on this page is aspirational. Future additions
            (Phone OTP, WhatsApp alerts, offline PWA) are tracked in our public
            roadmap, not advertised here.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.tier}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {t.tier}
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                {t.items.map((item) => (
                  <li
                    key={item.name}
                    className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                  >
                    <p className="font-mono text-sm text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.use}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
