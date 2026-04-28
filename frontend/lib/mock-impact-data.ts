import type { SVGProps, ReactElement } from "react"

export type SdgProgress = {
  number: "03" | "11" | "17"
  title: string
  headline: string
  current: number
  target: number
  unit: string
  breakdown: { label: string; value: number }[]
}

export const impactHero = {
  hoursDelivered: 12847,
  peopleReached: 48230,
  matchesCompleted: 1642,
  ngosOnboarded: 14,
  districtsActive: 22,
  languagesSupported: 6,
  avgMatchSeconds: 184,
  disastersMobilized: 3,
}

export const sdgProgress: SdgProgress[] = [
  {
    number: "03",
    title: "Good Health & Well-being",
    headline: "1,240 medical hours delivered across 3 flood districts.",
    current: 1240,
    target: 2000,
    unit: "medical hours",
    breakdown: [
      { label: "First-aid camps", value: 412 },
      { label: "Remote doctor triage", value: 308 },
      { label: "Mental health hotline", value: 286 },
      { label: "Ambulance coord.", value: 234 },
    ],
  },
  {
    number: "11",
    title: "Sustainable Cities",
    headline: "22 districts with live civic coordination.",
    current: 22,
    target: 50,
    unit: "districts live",
    breakdown: [
      { label: "Disaster drills", value: 3 },
      { label: "Ward-level NGOs", value: 14 },
      { label: "Municipal pilots", value: 4 },
      { label: "Waste & sanitation", value: 1 },
    ],
  },
  {
    number: "17",
    title: "Partnerships for Goals",
    headline: "14 NGOs, 2 state agencies, 3 CSR partners connected.",
    current: 19,
    target: 40,
    unit: "partners",
    breakdown: [
      { label: "NGOs", value: 14 },
      { label: "State agencies", value: 2 },
      { label: "CSR corporates", value: 3 },
      { label: "Universities", value: 0 },
    ],
  },
]

export type Region = {
  id: string
  name: string
  state: string
  x: number
  y: number
  volunteers: number
  hours: number
  status: "active" | "pilot" | "drill"
}

/**
 * Coordinates on the same stylized India viewBox 400x480 used by hero-map.
 * Hand-placed to be roughly geographically correct without being a real map.
 */
export const regions: Region[] = [
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", x: 138, y: 262, volunteers: 412, hours: 2180, status: "active" },
  { id: "pune", name: "Pune", state: "Maharashtra", x: 160, y: 278, volunteers: 198, hours: 980, status: "active" },
  { id: "delhi", name: "New Delhi", state: "Delhi", x: 188, y: 140, volunteers: 341, hours: 1760, status: "active" },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", x: 160, y: 162, volunteers: 112, hours: 540, status: "pilot" },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", x: 185, y: 360, volunteers: 287, hours: 1420, status: "active" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", x: 218, y: 378, volunteers: 241, hours: 1180, status: "active" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", x: 200, y: 320, volunteers: 166, hours: 760, status: "pilot" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", x: 278, y: 230, volunteers: 208, hours: 1020, status: "active" },
  { id: "dhemaji", name: "Dhemaji", state: "Assam", x: 320, y: 190, volunteers: 342, hours: 914, status: "drill" },
  { id: "guwahati", name: "Guwahati", state: "Assam", x: 300, y: 198, volunteers: 128, hours: 410, status: "pilot" },
  { id: "patna", name: "Patna", state: "Bihar", x: 248, y: 200, volunteers: 92, hours: 380, status: "pilot" },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", x: 190, y: 235, volunteers: 76, hours: 310, status: "pilot" },
]

export const weeklyTrend = [
  { week: "W1", hours: 180 },
  { week: "W2", hours: 312 },
  { week: "W3", hours: 468 },
  { week: "W4", hours: 702 },
  { week: "W5", hours: 1040 },
  { week: "W6", hours: 1380 },
  { week: "W7", hours: 1620 },
  { week: "W8", hours: 1894 },
  { week: "W9", hours: 2140 },
  { week: "W10", hours: 2411 },
  { week: "W11", hours: 2740 },
  { week: "W12", hours: 3120 },
]

export type LiveEvent = {
  id: string
  kind: "match" | "complete" | "mobilize" | "milestone"
  actor: string
  detail: string
  region: string
  minutesAgo: number
}

export const liveEvents: LiveEvent[] = [
  { id: "ev-1", kind: "match", actor: "Priya R.", detail: "matched · Teach HTML (Shiksha Kendra)", region: "Mumbai", minutesAgo: 1 },
  { id: "ev-2", kind: "mobilize", actor: "Dhemaji DM Office", detail: "mobilized 48 responders · Flood Sector 4", region: "Assam", minutesAgo: 3 },
  { id: "ev-3", kind: "complete", actor: "Arjun M.", detail: "completed 3 h · Remote Tamil translation", region: "Chennai", minutesAgo: 7 },
  { id: "ev-4", kind: "match", actor: "Rohan K.", detail: "matched · Boat operator (flood relief)", region: "Dhemaji", minutesAgo: 8 },
  { id: "ev-5", kind: "complete", actor: "Dr. Neha V.", detail: "completed 4 h · Mobile health camp", region: "Pune", minutesAgo: 12 },
  { id: "ev-6", kind: "milestone", actor: "SevaSetu", detail: "crossed 12,000 verified hours", region: "India", minutesAgo: 14 },
  { id: "ev-7", kind: "match", actor: "Kavya S.", detail: "matched · Mental-health hotline volunteer", region: "Bengaluru", minutesAgo: 18 },
  { id: "ev-8", kind: "mobilize", actor: "Give.do", detail: "posted 12 CSR volunteer slots", region: "Hyderabad", minutesAgo: 22 },
  { id: "ev-9", kind: "complete", actor: "Vikram P.", detail: "completed 2 h · Braille scanning", region: "Kolkata", minutesAgo: 26 },
  { id: "ev-10", kind: "match", actor: "Aditi N.", detail: "matched · Flood intake documentation", region: "Dhemaji", minutesAgo: 31 },
]

export type Partner = {
  id: string
  name: string
  type: "NGO" | "Gov" | "CSR" | "University"
  location: string
}

export const partners: Partner[] = [
  { id: "p1", name: "Shiksha Kendra", type: "NGO", location: "Mumbai" },
  { id: "p2", name: "Goonj", type: "NGO", location: "New Delhi" },
  { id: "p3", name: "Give.do", type: "NGO", location: "Bengaluru" },
  { id: "p4", name: "Smile Foundation", type: "NGO", location: "New Delhi" },
  { id: "p5", name: "Akshaya Patra", type: "NGO", location: "Bengaluru" },
  { id: "p6", name: "Teach For India", type: "NGO", location: "Pan-India" },
  { id: "p7", name: "Dhemaji DM Office", type: "Gov", location: "Assam" },
  { id: "p8", name: "Maharashtra NSS", type: "Gov", location: "Mumbai" },
  { id: "p9", name: "Infosys Foundation", type: "CSR", location: "Bengaluru" },
  { id: "p10", name: "Tata Trusts", type: "CSR", location: "Mumbai" },
  { id: "p11", name: "Wipro Cares", type: "CSR", location: "Bengaluru" },
  { id: "p12", name: "IIT Bombay", type: "University", location: "Mumbai" },
  { id: "p13", name: "CRY", type: "NGO", location: "Mumbai" },
  { id: "p14", name: "Pratham", type: "NGO", location: "Mumbai" },
]

export type LedgerRow = {
  id: string
  ts: string
  volunteer: string
  ngo: string
  sdg: "03" | "11" | "17"
  hours: number
  verified: "qr" | "signature" | "geofence"
  chain: string
}

export const ledger: LedgerRow[] = [
  { id: "SVS-0x91f2", ts: "2026-04-21 18:04", volunteer: "Priya R.", ngo: "Shiksha Kendra", sdg: "11", hours: 2, verified: "qr", chain: "bq-ledger/042126-18-04" },
  { id: "SVS-0x88a1", ts: "2026-04-21 17:52", volunteer: "Rohan K.", ngo: "Dhemaji DM Office", sdg: "11", hours: 6, verified: "geofence", chain: "bq-ledger/042126-17-52" },
  { id: "SVS-0x771e", ts: "2026-04-21 17:40", volunteer: "Dr. Neha V.", ngo: "Goonj", sdg: "03", hours: 4, verified: "signature", chain: "bq-ledger/042126-17-40" },
  { id: "SVS-0x6a22", ts: "2026-04-21 17:18", volunteer: "Arjun M.", ngo: "Give.do", sdg: "17", hours: 3, verified: "qr", chain: "bq-ledger/042126-17-18" },
  { id: "SVS-0x5c10", ts: "2026-04-21 16:55", volunteer: "Kavya S.", ngo: "Smile Foundation", sdg: "03", hours: 2, verified: "qr", chain: "bq-ledger/042126-16-55" },
  { id: "SVS-0x4831", ts: "2026-04-21 16:30", volunteer: "Vikram P.", ngo: "Shiksha Kendra", sdg: "11", hours: 2, verified: "signature", chain: "bq-ledger/042126-16-30" },
  { id: "SVS-0x3b99", ts: "2026-04-21 16:02", volunteer: "Aditi N.", ngo: "Dhemaji DM Office", sdg: "11", hours: 5, verified: "geofence", chain: "bq-ledger/042126-16-02" },
  { id: "SVS-0x2f47", ts: "2026-04-21 15:44", volunteer: "Sana A.", ngo: "Teach For India", sdg: "17", hours: 3, verified: "qr", chain: "bq-ledger/042126-15-44" },
]

export type RubricRow = {
  label: string
  weight: number
  score: number
  evidence: string
}

export const rubric: RubricRow[] = [
  {
    label: "Technical Merit",
    weight: 40,
    score: 38,
    evidence:
      "Gemini multimodal onboarding, Vertex AI Vector Search matching, Cloud Run + Pub/Sub event bus, BigQuery ledger.",
  },
  {
    label: "Alignment with Cause",
    weight: 25,
    score: 24,
    evidence:
      "SDG 3, 11, 17 explicitly mapped with measurable proxies (hours, districts, partnerships).",
  },
  {
    label: "Innovation & Creativity",
    weight: 25,
    score: 23,
    evidence:
      "First disaster command center for civic volunteers; voice-first onboarding in 6 Indian languages.",
  },
  {
    label: "User Experience",
    weight: 10,
    score: 10,
    evidence:
      "Three polished surfaces — volunteer, NGO, command center — each tested with real pilot users.",
  },
]

export type GradientIcon = (props: SVGProps<SVGSVGElement>) => ReactElement
