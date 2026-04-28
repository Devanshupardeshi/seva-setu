import Link from "next/link"
import { Logo } from "./logo"

const columns = [
  {
    title: "Product",
    links: [
      { href: "/volunteer", label: "Volunteer app" },
      { href: "/ngo", label: "NGO dashboard" },
      { href: "/command-center", label: "Command center" },
      { href: "/impact", label: "Impact ledger" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "About" },
      { href: "#", label: "Team" },
      { href: "#", label: "Press" },
      { href: "#", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#", label: "Architecture" },
      { href: "#", label: "API docs" },
      { href: "#", label: "Open source" },
      { href: "#", label: "Privacy" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="font-serif text-2xl tracking-tight">
                SevaSetu
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              A bridge between willing hands and urgent needs. Built in India,
              for the world, on Google Cloud.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Google Solution Challenge 2026 · Smart Resource Allocation track
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {col.title}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SevaSetu. Made with service in mind.</p>
          <p className="font-mono">
            SDG 3 · SDG 11 · SDG 17
          </p>
        </div>
      </div>
    </footer>
  )
}
