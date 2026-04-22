import type {
  Briefing,
  Incident,
  Match,
  NGO,
  Need,
  Volunteer,
} from "./types"

// ----- The current logged-in volunteer -----
export const currentVolunteer: Volunteer = {
  id: "v_priya",
  name: "Priya Sharma",
  phone: "+91 98XXX 41203",
  avatarUrl: "/images/priya-avatar.jpg",
  location: {
    lat: 19.1197,
    lng: 72.8468,
    label: "Andheri West, Mumbai",
  },
  skills: [
    "Teaching",
    "Python",
    "Web design",
    "Math",
    "Public speaking",
    "Translation (Hindi ↔ English)",
  ],
  languages: ["Hindi", "English", "Marathi"],
  availability: ["sat", "sun"],
  experience: "student",
  remoteOk: true,
  trustScore: 4.8,
  hoursGiven: 48,
  peopleHelped: 63,
  projectsCompleted: 9,
  joinedAt: "2025-11-02",
}

// ----- Partner NGOs -----
export const ngos: NGO[] = [
  {
    id: "n_shiksha",
    name: "Shiksha Kendra",
    darpanId: "MH/2021/0304512",
    verified: true,
    location: { lat: 19.0596, lng: 72.8295, label: "Bandra West, Mumbai" },
    focusAreas: ["Education", "Digital literacy"],
    rating: 4.9,
    volunteersActive: 128,
    since: "2014",
    about:
      "Weekend learning center for 200+ children from Bandra settlements. Runs coding, math and English clubs.",
  },
  {
    id: "n_goonj",
    name: "Goonj Mumbai Chapter",
    darpanId: "MH/2017/0122004",
    verified: true,
    location: { lat: 19.0821, lng: 72.8416, label: "Kurla, Mumbai" },
    focusAreas: ["Disaster relief", "Material aid"],
    rating: 4.8,
    volunteersActive: 412,
    since: "2009",
    about:
      "Urban-to-rural material flows. Activates rapid relief within 24 hours of any regional disaster.",
  },
  {
    id: "n_arogya",
    name: "Arogya Friends Network",
    darpanId: "MH/2019/0287119",
    verified: true,
    location: { lat: 19.1072, lng: 72.8302, label: "Khar, Mumbai" },
    focusAreas: ["Healthcare", "Mental health"],
    rating: 4.7,
    volunteersActive: 74,
    since: "2018",
    about:
      "Free mental-health helpline and monthly community health camps across Mumbai Suburban.",
  },
  {
    id: "n_green",
    name: "Green Pathways India",
    darpanId: "MH/2020/0341776",
    verified: true,
    location: { lat: 19.1551, lng: 72.8417, label: "Versova, Mumbai" },
    focusAreas: ["Climate", "Coastal restoration"],
    rating: 4.6,
    volunteersActive: 96,
    since: "2016",
    about:
      "Versova beach cleanups, mangrove replanting, and climate literacy workshops in BMC schools.",
  },
  {
    id: "n_disha",
    name: "Disha Women's Collective",
    darpanId: "MH/2022/0401223",
    verified: true,
    location: { lat: 19.0728, lng: 72.8826, label: "Dharavi, Mumbai" },
    focusAreas: ["Gender", "Livelihoods"],
    rating: 4.9,
    volunteersActive: 54,
    since: "2015",
    about:
      "Skill training, micro-entrepreneurship and legal aid for 3,000+ women across Dharavi and Sion.",
  },
  {
    id: "n_anna",
    name: "Anna Sahyog",
    darpanId: "MH/2018/0209864",
    verified: true,
    location: { lat: 19.1075, lng: 72.8677, label: "Santacruz East, Mumbai" },
    focusAreas: ["Food security", "Zero waste"],
    rating: 4.8,
    volunteersActive: 188,
    since: "2013",
    about:
      "Surplus-food rescue network across 140 restaurants, redistributing 8,000+ meals weekly.",
  },
]

// ----- Opportunities / Needs -----
export const needs: Need[] = [
  {
    id: "need_html",
    ngoId: "n_shiksha",
    title: "Teach basic HTML to 10 kids",
    description:
      "Saturday workshop for 10–12 year olds. 5 laptops available. Your session will cover what a web page is and help kids build their first page about themselves.",
    skillsRequired: ["Teaching", "Web design"],
    languagesPreferred: ["Hindi", "English"],
    startTime: "2026-04-25T15:00:00+05:30",
    durationHours: 2,
    location: { lat: 19.0596, lng: 72.8295, label: "Bandra West, Mumbai" },
    urgency: "routine",
    slots: 1,
    filled: 0,
    tags: ["education", "women-only"],
    matchScore: 96,
    matchReason:
      "You've run two teaching gigs, know web design, and speak Hindi + English — a strong fit for this cohort.",
  },
  {
    id: "need_translate",
    ngoId: "n_goonj",
    title: "Remote: Tamil ↔ English translation",
    description:
      "Translate field reports from Tamil Nadu cyclone relief teams for the central coordination cell. Fully remote, pick any 3-hour block this weekend.",
    skillsRequired: ["Translation"],
    languagesPreferred: ["Tamil", "English"],
    startTime: "2026-04-26T10:00:00+05:30",
    durationHours: 3,
    location: { lat: 19.0821, lng: 72.8416, label: "Remote" },
    urgency: "priority",
    slots: 4,
    filled: 1,
    tags: ["disaster", "remote"],
    matchScore: 82,
    matchReason:
      "You flagged translation experience during onboarding — Goonj prioritises returning volunteers.",
  },
  {
    id: "need_helpline",
    ngoId: "n_arogya",
    title: "Evening helpline listener",
    description:
      "Two-hour empathetic listening shift on the Arogya helpline. Training module included. Must be calm, patient, and confidential.",
    skillsRequired: ["Active listening", "Empathy"],
    languagesPreferred: ["Hindi", "Marathi"],
    startTime: "2026-04-25T19:00:00+05:30",
    durationHours: 2,
    location: { lat: 19.1072, lng: 72.8302, label: "Khar, Mumbai" },
    urgency: "routine",
    slots: 3,
    filled: 1,
    tags: ["health", "women-only"],
    matchScore: 71,
    matchReason:
      "You listed public speaking and you're in Andheri — 5.8 km to the helpline office.",
  },
  {
    id: "need_beach",
    ngoId: "n_green",
    title: "Versova beach cleanup · Sunday dawn",
    description:
      "Join 60 others for a 6 AM beach cleanup. Bags, gloves and breakfast provided. Great for groups — bring friends.",
    skillsRequired: ["Physical activity"],
    startTime: "2026-04-26T06:00:00+05:30",
    durationHours: 3,
    location: { lat: 19.1551, lng: 72.8417, label: "Versova Beach, Mumbai" },
    urgency: "routine",
    slots: 20,
    filled: 14,
    tags: ["environment"],
    matchScore: 64,
    matchReason:
      "Nearby and social. A good reset weekend if you don't want to teach this Saturday.",
  },
  {
    id: "need_poster",
    ngoId: "n_disha",
    title: "One-time: Design Women's Day posters",
    description:
      "Remote design brief for 4 posters (Instagram + print). Brief and brand assets shared on acceptance. Turnaround: 5 days.",
    skillsRequired: ["Graphic design", "Web design"],
    startTime: "2026-04-28T10:00:00+05:30",
    durationHours: 6,
    location: { lat: 19.0728, lng: 72.8826, label: "Remote" },
    urgency: "routine",
    slots: 2,
    filled: 0,
    tags: ["design", "remote", "women-only"],
    matchScore: 88,
    matchReason:
      "You have web design chops and Disha prefers first-time designers for this batch.",
  },
]

// ----- Pre-generated briefings (the Gemini output artifact) -----
export const briefings: Record<string, Briefing> = {
  need_html: {
    needId: "need_html",
    prep: [
      "The kids already know how to open Chrome and type search queries — start from there.",
      "Most speak Marathi at home but follow Hindi classroom instructions easily.",
      "Keep vocabulary simple — no jargon like 'semantic markup' or 'DOM'.",
    ],
    lessonPlan: [
      "10 min — Ice-breaker: ask each kid their favourite website and why",
      "20 min — What is a web page? Live-edit a <h1> and <p> on screen",
      "30 min — Kids build a one-page site 'About me' with 5 elements",
      "20 min — Peer showcase + save to pen-drive + group photo",
    ],
    whatToBring: [
      "Your laptop with VS Code pre-installed",
      "A pen-drive (≥4 GB) with starter HTML files",
      "A simple printed cheat-sheet of tags (we'll email a PDF by Friday)",
    ],
    culturalNotes: [
      "Most kids come straight from Hindi-medium schools — offer Hindi explanations whenever you use an English term.",
      "Use first names warmly. 'Didi' or 'Priya didi' will feel natural to them.",
      "Cameras on phones are OK but ask teachers before posting any photos online.",
    ],
    safety: [
      "The center is a first-floor walk-up; the gate shuts at 7 PM.",
      "For any incident, call Shiksha Kendra coordinator Meena: +91 98XXX 00912.",
      "Session is supervised — a staff teacher will be in the room throughout.",
    ],
    route: {
      mode: "Metro + walk",
      distanceKm: 6.4,
      etaMin: 34,
      landmarks: [
        "Andheri station (starting)",
        "Mumbai Metro Line 1 → DN Nagar → Change to Line 2A",
        "Get off at Bandra BKC; 6-min walk to Shiksha Kendra",
      ],
    },
  },
  inc_dhemaji: {
    needId: "inc_dhemaji",
    prep: [
      "Check your personal safety gear (boots, raincoat, flashlight).",
      "Review the disaster mobilization protocol for Red severity incidents.",
      "Ensure your phone is fully charged and you have a power bank.",
    ],
    whatToBring: [
      "Personal ID and SevaSetu digital ID card.",
      "Emergency first aid kit.",
      "Water bottle and energy bars for 6 hours.",
    ],
    culturalNotes: [
      "Dhemaji is a sensitive zone; follow local authorities' instructions without question.",
      "Respect local customs when entering relief camps.",
    ],
    safety: [
      "Do not enter water deeper than knee level without a life jacket.",
      "Report to the DEOC Dhemaji staging area for your specific assignment.",
      "Maintain radio/phone silence unless reporting an emergency.",
    ],
    route: {
      mode: "Emergency Transit",
      distanceKm: 18.2,
      etaMin: 45,
      landmarks: [
        "Starting from Staging Area A",
        "NH-15 (Restricted Access)",
        "Dhemaji Town Gate",
      ],
    },
  },
}

// ----- The current user's match history -----
export const matches: Match[] = [
  {
    id: "m_next",
    volunteerId: "v_priya",
    needId: "need_html",
    status: "accepted",
    acceptedAt: "2026-04-20T09:14:00+05:30",
  },
  {
    id: "m_past_1",
    volunteerId: "v_priya",
    needId: "need_beach",
    status: "completed",
    acceptedAt: "2026-03-29T06:00:00+05:30",
    completedAt: "2026-03-29T09:00:00+05:30",
    rating: 5,
    reviewText: "Priya organised a whole cleanup pod herself. Hope she comes back.",
  },
  {
    id: "m_past_2",
    volunteerId: "v_priya",
    needId: "need_translate",
    status: "completed",
    acceptedAt: "2026-02-14T10:00:00+05:30",
    completedAt: "2026-02-14T13:00:00+05:30",
    rating: 5,
  },
]

// ----- A live incident for the Disaster Command Center (session 4) -----
export const activeIncident: Incident = {
  id: "inc_dhemaji",
  type: "flood",
  title: "Dhemaji district · Brahmaputra flood",
  epicenter: { lat: 27.4836, lng: 94.5824, label: "Dhemaji, Assam" },
  radiusKm: 180,
  severity: "red",
  activatedAt: "2026-04-21T18:02:00+05:30",
  skillsNeeded: [
    { skill: "First aid", needed: 40, filled: 28 },
    { skill: "Boat operation", needed: 20, filled: 12 },
    { skill: "Assamese translation", needed: 15, filled: 14 },
    { skill: "Medical doctor", needed: 12, filled: 8 },
    { skill: "Logistics", needed: 25, filled: 21 },
    { skill: "Counselling", needed: 10, filled: 3 },
  ],
  respondersCommitted: 342,
  respondersEnRoute: 187,
  respondersOnSite: 91,
}

// ----- Government / Disaster Cell NGO for incidents -----
export const govtNgo: NGO = {
  id: "n_govt",
  name: "District Disaster Management Authority",
  darpanId: "GOVT/ASSAM/DHEMAJI",
  verified: true,
  location: { lat: 27.4836, lng: 94.5824, label: "Dhemaji, Assam" },
  focusAreas: ["Disaster management", "Rescue"],
  rating: 5.0,
  volunteersActive: 1200,
  since: "1999",
  about: "The primary response agency for Dhemaji district.",
}

export const incidentOperator = {
  name: "Comm. Rajesh Kumar",
  role: "Incident Commander",
  region: "Dhemaji District",
  badgeId: "DDMA-9921"
}

// ----- Helpers -----
export function getNeedById(id: string): Need | undefined {
  const found = needs.find((n) => n.id === id)
  if (found) return found

  // If it's an incident, convert to a Need-like object for the UI
  if (id === activeIncident.id) {
    return {
      id: activeIncident.id,
      ngoId: "n_govt",
      title: activeIncident.title,
      description: `Active ${activeIncident.type} incident. Emergency responders needed immediately for ${activeIncident.skillsNeeded.map(s => s.skill).join(", ")}.`,
      skillsRequired: activeIncident.skillsNeeded.map(s => s.skill),
      startTime: activeIncident.activatedAt,
      durationHours: 12, // Standard shift
      location: activeIncident.epicenter,
      urgency: "critical",
      slots: activeIncident.skillsNeeded.reduce((a, b) => a + b.needed, 0),
      filled: activeIncident.skillsNeeded.reduce((a, b) => a + b.filled, 0),
      matchScore: 99,
      matchReason: "Critical incident in your region matching your emergency skills.",
    }
  }

  return undefined
}
export function getNgoById(id: string) {
  if (id === "n_govt") return govtNgo
  return ngos.find((n) => n.id === id)
}
export function getBriefingById(id: string) {
  return briefings[id]
}
