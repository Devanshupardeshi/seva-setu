const tiers = [
  {
    tier: "AI",
    items: [
      { name: "Gemini 2.5 Pro", use: "Voice → structured profile, briefing generation" },
      { name: "Vertex AI Vector Search", use: "Sub-second semantic skill matching" },
      { name: "Vertex AI Embeddings", use: "text-embedding-004 for volunteers & needs" },
      { name: "Speech-to-Text", use: "Fallback for regional dialects" },
    ],
  },
  {
    tier: "Backend",
    items: [
      { name: "Cloud Run", use: "Stateless API services, autoscale to zero" },
      { name: "Cloud Functions", use: "Firestore & Storage triggers" },
      { name: "Pub/Sub", use: "Match, notify, analytics event bus" },
      { name: "Firestore", use: "Operational DB with real-time sync" },
      { name: "BigQuery", use: "Analytics warehouse + impact reports" },
      { name: "Cloud Storage", use: "Audio intros, generated PDFs" },
    ],
  },
  {
    tier: "Frontend & APIs",
    items: [
      { name: "Flutter", use: "Volunteer mobile app" },
      { name: "Next.js + shadcn/ui", use: "NGO & Command Center dashboards" },
      { name: "Firebase Auth", use: "Phone OTP sign-in" },
      { name: "Firebase Cloud Messaging", use: "Push notifications" },
      { name: "Google Maps Platform", use: "Routes, geofencing, heatmap" },
      { name: "Looker Studio", use: "Public impact dashboard" },
    ],
  },
]

export function TechStack() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Built on Google Cloud
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            End-to-end Google stack.
            <span className="italic text-primary"> No glue code shortcuts.</span>
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Technical Merit is 40% of the judging score. Every layer of
            SevaSetu is deliberately chosen from Google Cloud — not to tick
            boxes, but because each service is the best tool for the job.
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
