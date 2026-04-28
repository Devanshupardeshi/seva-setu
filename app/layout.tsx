import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { FCMSubscriber } from "@/components/fcm-subscriber"
import { Toaster } from "sonner"
import { ModeProvider } from "@/frontend/lib/mode/mode-context"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: "SevaSetu — A bridge between willing hands and urgent needs",
  description:
    "AI-powered, multilingual volunteer coordination for India. Built for Google Solution Challenge 2026. Match volunteers to NGOs and disaster response in minutes, not days.",
  generator: "v0.app",
  keywords: [
    "volunteer",
    "NGO",
    "disaster response",
    "Google Solution Challenge",
    "Gemini",
    "Vertex AI",
    "India",
    "civic tech",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SevaSetu",
  },
  openGraph: {
    title: "SevaSetu — A bridge between willing hands and urgent needs",
    description:
      "AI-powered volunteer coordination for NGOs and disaster response across India.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1a16" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ModeProvider>
          <FCMSubscriber />
          {children}
          <Toaster closeButton position="top-right" richColors />
          {process.env.NODE_ENV === "production" && <Analytics />}
        </ModeProvider>
      </body>
    </html>
  )
}
