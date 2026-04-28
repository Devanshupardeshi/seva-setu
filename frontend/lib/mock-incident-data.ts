import type { Incident } from "./types"
import { activeIncident } from "./mock-data"

// The official from the DM Office who is operating this incident.
export const incidentOperator = {
  name: "Aarti Phukan, IAS",
  role: "Additional District Magistrate",
  office: "District Magistrate's Office · Dhemaji",
  phone: "+91 376-222-XXXX",
  activatedBy: "Dhemaji DEOC · shift-2",
}

// Sectors inside the incident geofence.
export type Sector = {
  id: string
  label: string
  population: number
  status: "secured" | "partial" | "unreached"
  onSite: number
  needed: number
  note: string
}

export const sectors: Sector[] = [
  {
    id: "s1",
    label: "Sector 1 · Gogamukh",
    population: 8400,
    status: "secured",
    onSite: 34,
    needed: 30,
    note: "2 boats operational, medical post live",
  },
  {
    id: "s2",
    label: "Sector 2 · Silapathar",
    population: 12200,
    status: "partial",
    onSite: 22,
    needed: 40,
    note: "Power grid down, translators needed",
  },
  {
    id: "s3",
    label: "Sector 3 · Jonai",
    population: 6800,
    status: "partial",
    onSite: 18,
    needed: 25,
    note: "Road access via NH-15 only",
  },
  {
    id: "s4",
    label: "Sector 4 · Bordoibam-Bilmukh",
    population: 3200,
    status: "unreached",
    onSite: 4,
    needed: 20,
    note: "No boats yet · priority target",
  },
]

// Staging areas where responders rendezvous before entering sectors.
export type Staging = { id: string; label: string; responders: number }

export const stagingAreas: Staging[] = [
  { id: "st1", label: "DEOC Dhemaji", responders: 58 },
  { id: "st2", label: "Silapathar relief camp", responders: 41 },
  { id: "st3", label: "Jonai NDRF base", responders: 33 },
]

// Responders currently tracked by the system. Each has a status and a normalised
// position on the map (0..1 on both axes) so the live map can render them.
export type Responder = {
  id: string
  name: string
  skill: string
  status: "on-site" | "en-route" | "committed"
  etaMin?: number
  distanceKm?: number
  // Normalised map position (0=left/top, 1=right/bottom)
  x: number
  y: number
  sector?: string
}

// A curated set of 48 responders — dense enough for the map to feel alive,
// sparse enough to identify individuals in the responder list.
export const responders: Responder[] = [
  // --- Sector 1 on-site (top-left area of map) ---
  { id: "r1", name: "Dr. Gogoi", skill: "Medical doctor", status: "on-site", x: 0.28, y: 0.32, sector: "s1" },
  { id: "r2", name: "Bijoy Saikia", skill: "Boat operation", status: "on-site", x: 0.24, y: 0.36, sector: "s1" },
  { id: "r3", name: "Anjali Das", skill: "First aid", status: "on-site", x: 0.3, y: 0.38, sector: "s1" },
  { id: "r4", name: "Rohan Bora", skill: "Logistics", status: "on-site", x: 0.26, y: 0.42, sector: "s1" },
  { id: "r5", name: "Dr. Mahanta", skill: "Medical doctor", status: "on-site", x: 0.32, y: 0.35, sector: "s1" },
  { id: "r6", name: "Minu Kakati", skill: "Counselling", status: "on-site", x: 0.27, y: 0.39, sector: "s1" },

  // --- Sector 2 on-site (center-top) ---
  { id: "r7", name: "Hiren Gogoi", skill: "First aid", status: "on-site", x: 0.48, y: 0.3, sector: "s2" },
  { id: "r8", name: "Priya Khanikar", skill: "Assamese translation", status: "on-site", x: 0.52, y: 0.34, sector: "s2" },
  { id: "r9", name: "Dr. Kashyap", skill: "Medical doctor", status: "on-site", x: 0.5, y: 0.38, sector: "s2" },
  { id: "r10", name: "Samir Baruah", skill: "Python / Data", status: "on-site", x: 0.46, y: 0.42, sector: "s2" },

  // --- En-route (scattered around the edges) ---
  { id: "r11", name: "Suman Das", skill: "Medical doctor", status: "en-route", etaMin: 14, distanceKm: 8.2, x: 0.1, y: 0.2 },
  { id: "r12", name: "Rahul Bora", skill: "Boat operation", status: "en-route", etaMin: 22, distanceKm: 12.5, x: 0.8, y: 0.15 },
  { id: "r13", name: "Dipali Saikia", skill: "Counselling", status: "en-route", etaMin: 8, distanceKm: 4.1, x: 0.4, y: 0.9 },
]

// Live event log — what's happening in the last 4 minutes.
export type IncidentEvent = {
  id: string
  t: string // "HH:MM:SS" relative to activation
  kind: "accept" | "arrive" | "alert" | "mobilize" | "dispatch" | "report"
  title: string
  sub?: string
}

export const incidentEvents: IncidentEvent[] = [
  { id: "e1", t: "00:00:00", kind: "alert", title: "Incident activated · severity RED", sub: "District Magistrate · Dhemaji" },
  { id: "e2", t: "00:00:04", kind: "mobilize", title: "12,480 volunteers queried in 180 km radius", sub: "Vertex AI Vector Search · skill-ranked" },
  { id: "e3", t: "00:00:12", kind: "mobilize", title: "Bulk push + Inbox + WhatsApp fanned out to 4,128", sub: "Firebase Cloud Messaging + Native Inbox" },
  { id: "e4", t: "00:01:34", kind: "accept", title: "Dr. Kashyap accepted · Sector 2", sub: "ETA 31 min · Guwahati GMCH" },
  { id: "e5", t: "00:02:07", kind: "accept", title: "Bijoy Saikia accepted · Boat operator", sub: "Already on-site at Gogamukh" },
  { id: "e6", t: "00:02:41", kind: "dispatch", title: "Sector 1 staging ready · 34 responders", sub: "Handoff to on-ground lead" },
  { id: "e7", t: "00:03:12", kind: "alert", title: "Gap alert: Sector 4 · +8 boat operators needed", sub: "Auto-escalated to NDRF regional cell" },
  { id: "e8", t: "00:03:48", kind: "report", title: "First situation report compiled", sub: "Sent to State EOC · Dispur" },
  { id: "e9", t: "00:04:10", kind: "accept", title: "Junu Saikia accepted · Assamese translator", sub: "ETA 12 min · remote support enabled" },
]

// Outbound call recommendations — what the system suggests the DM do next.
export type Recommendation = {
  id: string
  priority: "critical" | "high" | "medium"
  title: string
  rationale: string
  action: string
  contact: string
}

export const recommendations: Recommendation[] = [
  {
    id: "rec1",
    priority: "critical",
    title: "Dispatch 8 more boat operators to Sector 4",
    rationale:
      "Bordoibam-Bilmukh is unreached. Only 4 responders on-site vs. 20 needed. No boats yet.",
    action: "Outbound call to NDRF 12th Battalion · request 2 rescue boats + crew",
    contact: "NDRF NE Cell · +91 361-222-XXXX",
  },
  {
    id: "rec2",
    priority: "high",
    title: "Request 8 additional doctors",
    rationale:
      "Medical cover is at 67% (8 of 12). Silapathar relief camp running below threshold for 12,200 population.",
    action: "Contact Assam Medical College, Dibrugarh · activate weekend duty pool",
    contact: "Principal, AMC Dibrugarh · +91 373-230-XXXX",
  },
  {
    id: "rec3",
    priority: "medium",
    title: "Arrange counsellors for separated families",
    rationale:
      "Counselling pool at 30% (3 of 10). Expected demand rises 3× in the next 24 hrs based on 2023 Dhemaji floods.",
    action: "iCall helpline handoff · 12 trained listeners on standby",
    contact: "iCall Mumbai · coordination@icallhelp.in",
  },
]

export { activeIncident }

// Past drills to show track record.
export type PastDrill = {
  id: string
  date: string
  location: string
  type: Incident["type"]
  mobilized: number
  mobilizeMin: number
}

export const pastDrills: PastDrill[] = [
  { id: "d1", date: "Mar 2026", location: "Mumbai · Borivali", type: "fire", mobilized: 214, mobilizeMin: 9 },
  { id: "d2", date: "Feb 2026", location: "Chennai · Marina", type: "flood", mobilized: 480, mobilizeMin: 11 },
  { id: "d3", date: "Jan 2026", location: "Pune · Lohegaon", type: "earthquake", mobilized: 156, mobilizeMin: 7 },
]
