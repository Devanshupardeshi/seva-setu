// Shared domain types for SevaSetu.
// Mirrors the Firestore data model from the PRD (Section 7).

export type Geo = { lat: number; lng: number; label: string }

export type Availability = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

export type Urgency = "routine" | "priority" | "critical"

export type Volunteer = {
  id: string
  name: string
  phone: string
  avatarUrl?: string
  location: Geo
  skills: string[]
  languages: string[]
  availability: Availability[]
  experience: "student" | "early-career" | "professional" | "retired"
  remoteOk: boolean
  trustScore: number // 0..5
  hoursGiven: number
  peopleHelped: number
  projectsCompleted: number
  joinedAt: string
}

export type NGO = {
  id: string
  name: string
  darpanId: string
  verified: boolean
  location: Geo
  focusAreas: string[]
  rating: number
  volunteersActive: number
  since: string
  about: string
}

export type Need = {
  id: string
  ngoId: string
  title: string
  description: string
  skillsRequired: string[]
  languagesPreferred?: string[]
  startTime: string // ISO
  durationHours: number
  location: Geo
  urgency: Urgency
  slots: number
  filled: number
  // AI reasoning shown in card
  matchScore: number // 0..100 for the current volunteer
  matchReason: string
}

export type Briefing = {
  needId: string
  prep: string[]
  lessonPlan?: string[]
  whatToBring: string[]
  culturalNotes: string[]
  safety: string[]
  route: { mode: string; distanceKm: number; etaMin: number; landmarks: string[] }
}

export type MatchStatus = "suggested" | "accepted" | "completed" | "declined"

export type Match = {
  id: string
  volunteerId: string
  needId: string
  status: MatchStatus
  acceptedAt?: string
  completedAt?: string
  rating?: number
  reviewText?: string
}

export type Incident = {
  id: string
  type: "flood" | "fire" | "earthquake" | "medical" | "heatwave"
  title: string
  epicenter: Geo
  radiusKm: number
  severity: "yellow" | "orange" | "red"
  activatedAt: string
  skillsNeeded: { skill: string; needed: number; filled: number }[]
  respondersEnRoute: number
  respondersCommitted: number
  respondersOnSite: number
}
