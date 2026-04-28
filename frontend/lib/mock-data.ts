import type {
  Briefing,
  Incident,
  Match,
  NGO,
  Need,
  Volunteer,
} from "./types"

/**
 * Mock fixtures themed around the Brahmaputra basin (Assam) — the same
 * region as the live disaster command center demo (Dhemaji flood). Names,
 * locations, languages and needs are chosen to reflect a realistic
 * volunteer-coordination story along the river: Mishing weaver co-ops in
 * Majuli, flood-displaced classrooms in Guwahati, Assamese-language
 * trauma helplines in Tezpur, and so on.
 *
 * IDs (e.g. "v_priya", "n_shiksha", "need_html") are kept unchanged so
 * mock-ngo-data, mock-incident-data and the Firestore seed script all
 * keep working without edits.
 */

// ----- The current logged-in volunteer -----------------------------------
export const currentVolunteer: Volunteer = {
  id: "v_priya",
  name: "Anjali Borah",
  phone: "+91 98XXX 41203",
  avatarUrl: "/images/priya-avatar.jpg",
  location: {
    lat: 26.1445,
    lng: 91.7362,
    label: "Zoo Road, Guwahati",
  },
  skills: [
    "Teaching",
    "Assamese translation",
    "First aid",
    "Boat handling",
    "Public speaking",
    "Digital literacy",
  ],
  languages: ["Assamese", "Hindi", "English", "Bengali"],
  availability: ["sat", "sun"],
  experience: "student",
  remoteOk: true,
  trustScore: 4.8,
  hoursGiven: 48,
  peopleHelped: 63,
  projectsCompleted: 9,
  joinedAt: "2025-11-02",
}

// ----- Partner NGOs ------------------------------------------------------
export const ngos: NGO[] = [
  {
    id: "n_shiksha",
    name: "Brahmaputra Education Trust",
    darpanId: "AS/2021/0304512",
    verified: true,
    location: { lat: 26.1158, lng: 91.7086, label: "Pan Bazaar, Guwahati" },
    focusAreas: ["Education", "Digital literacy"],
    rating: 4.9,
    volunteersActive: 128,
    since: "2014",
    about:
      "Weekend learning centres for 200+ flood-affected children across Guwahati's char (river-island) settlements. Runs coding, math and Assamese-English clubs.",
  },
  {
    id: "n_goonj",
    name: "Goonj · North-East Cell",
    darpanId: "AS/2017/0122004",
    verified: true,
    location: { lat: 26.1809, lng: 91.7531, label: "Beltola, Guwahati" },
    focusAreas: ["Disaster relief", "Material aid"],
    rating: 4.8,
    volunteersActive: 412,
    since: "2009",
    about:
      "Urban-to-riverine material flows. Activates rapid Brahmaputra flood relief within 24 hours across Dhemaji, Lakhimpur, Majuli and Morigaon.",
  },
  {
    id: "n_arogya",
    name: "Asha Health Network",
    darpanId: "AS/2019/0287119",
    verified: true,
    location: { lat: 26.6334, lng: 92.7926, label: "Mission Chariali, Tezpur" },
    focusAreas: ["Healthcare", "Mental health"],
    rating: 4.7,
    volunteersActive: 74,
    since: "2018",
    about:
      "Free Assamese-language mental-health helpline and monthly community health camps across Sonitpur and Darrang districts.",
  },
  {
    id: "n_green",
    name: "Green Brahmaputra Society",
    darpanId: "AS/2020/0341776",
    verified: true,
    location: { lat: 26.9527, lng: 94.1709, label: "Garmur, Majuli Island" },
    focusAreas: ["Climate", "River restoration"],
    rating: 4.6,
    volunteersActive: 96,
    since: "2016",
    about:
      "Riverbank erosion mapping, bamboo embankment building and climate literacy in Majuli's satras and BTC schools.",
  },
  {
    id: "n_disha",
    name: "Mahila Mukti Sangha",
    darpanId: "AS/2022/0401223",
    verified: true,
    location: { lat: 27.4728, lng: 94.9119, label: "Chowkidinghee, Dibrugarh" },
    focusAreas: ["Gender", "Livelihoods"],
    rating: 4.9,
    volunteersActive: 54,
    since: "2015",
    about:
      "Skill training, micro-entrepreneurship and legal aid for 3,000+ Mishing and tea-garden women across Upper Assam.",
  },
  {
    id: "n_anna",
    name: "Ahara Sahyog Assam",
    darpanId: "AS/2018/0209864",
    verified: true,
    location: { lat: 26.7509, lng: 94.2037, label: "AT Road, Jorhat" },
    focusAreas: ["Food security", "Zero waste"],
    rating: 4.8,
    volunteersActive: 188,
    since: "2013",
    about:
      "Surplus-food rescue network across 140 restaurants in Jorhat, Dibrugarh and Sivasagar — redistributing 8,000+ meals weekly to flood relief camps.",
  },
]

// ----- Opportunities / Needs --------------------------------------------
export const needs: Need[] = [
  {
    id: "need_html",
    ngoId: "n_shiksha",
    title: "Teach digital literacy to 10 char-school kids",
    description:
      "Saturday workshop for 10–12 year olds at our Pan Bazaar learning centre. 5 laptops available. Help kids — most from chars displaced by the last Brahmaputra flood — build their first webpage in Assamese.",
    skillsRequired: ["Teaching", "Digital literacy"],
    languagesPreferred: ["Assamese", "Hindi", "English"],
    startTime: "2026-04-25T15:00:00+05:30",
    durationHours: 2,
    location: { lat: 26.1158, lng: 91.7086, label: "Pan Bazaar, Guwahati" },
    urgency: "routine",
    slots: 1,
    filled: 0,
    tags: ["education", "women-only"],
    matchScore: 96,
    matchReason:
      "You've run two teaching gigs, know digital literacy, and speak Assamese + Hindi — a strong fit for this char cohort.",
  },
  {
    id: "need_translate",
    ngoId: "n_goonj",
    title: "Remote: Assamese ↔ English translation · flood reports",
    description:
      "Translate field reports from Dhemaji and Lakhimpur relief teams for the central coordination cell. Fully remote, pick any 3-hour block this weekend.",
    skillsRequired: ["Translation"],
    languagesPreferred: ["Assamese", "English"],
    startTime: "2026-04-26T10:00:00+05:30",
    durationHours: 3,
    location: { lat: 26.1809, lng: 91.7531, label: "Remote" },
    urgency: "priority",
    slots: 4,
    filled: 1,
    tags: ["disaster", "remote"],
    matchScore: 82,
    matchReason:
      "You flagged Assamese translation experience during onboarding — Goonj prioritises returning volunteers.",
  },
  {
    id: "need_helpline",
    ngoId: "n_arogya",
    title: "Evening helpline listener · Assamese",
    description:
      "Two-hour empathetic listening shift on the Asha helpline for flood-displaced families. Training module included. Must be calm, patient, and confidential.",
    skillsRequired: ["Active listening", "Empathy"],
    languagesPreferred: ["Assamese", "Bengali"],
    startTime: "2026-04-25T19:00:00+05:30",
    durationHours: 2,
    location: { lat: 26.6334, lng: 92.7926, label: "Mission Chariali, Tezpur" },
    urgency: "routine",
    slots: 3,
    filled: 1,
    tags: ["health", "women-only"],
    matchScore: 71,
    matchReason:
      "You listed public speaking and Assamese — a strong cultural fit for our trauma helpline.",
  },
  {
    id: "need_beach",
    ngoId: "n_green",
    title: "Brahmaputra riverbank cleanup · Sunday dawn",
    description:
      "Join 60 others for a 6 AM cleanup along the Majuli ghat. Bags, gloves and breakfast (jolpan + tea) provided. Great for groups — bring friends.",
    skillsRequired: ["Physical activity"],
    startTime: "2026-04-26T06:00:00+05:30",
    durationHours: 3,
    location: { lat: 26.9527, lng: 94.1709, label: "Garmur Ghat, Majuli" },
    urgency: "routine",
    slots: 20,
    filled: 14,
    tags: ["environment"],
    matchScore: 64,
    matchReason:
      "You've been on the platform for a year and Majuli is a 6-hour ferry-and-bus from Guwahati — overnight stay arranged.",
  },
  {
    id: "need_poster",
    ngoId: "n_disha",
    title: "One-time: Bihu posters for Mishing weavers' co-op",
    description:
      "Remote design brief for 4 Bihu posters (Instagram + print) showcasing Mishing handloom weavers. Brief and brand assets shared on acceptance. Turnaround: 5 days.",
    skillsRequired: ["Graphic design", "Digital literacy"],
    startTime: "2026-04-28T10:00:00+05:30",
    durationHours: 6,
    location: { lat: 27.4728, lng: 94.9119, label: "Remote" },
    urgency: "routine",
    slots: 2,
    filled: 0,
    tags: ["design", "remote", "women-only"],
    matchScore: 88,
    matchReason:
      "You have digital-design chops and Mahila Mukti prefers first-time designers for this batch.",
  },
]

// ----- Pre-generated briefings (the Gemini output artifact) -------------
export const briefings: Record<string, Briefing> = {
  need_html: {
    needId: "need_html",
    prep: [
      "Most kids come straight from char (river-island) primary schools — start by asking which song they sang at school assembly.",
      "They speak Assamese at home and follow Hindi classroom instructions easily, but English vocabulary is limited.",
      "Keep words simple — no jargon like 'semantic markup' or 'DOM'. Use Assamese for any abstract idea.",
    ],
    lessonPlan: [
      "10 min — Ice-breaker: each kid names their favourite Bihu song and why",
      "20 min — What is a webpage? Live-edit a <h1> and <p> with their name in Assamese",
      "30 min — Kids build a one-page site 'Mor xubhas' (My intro) with 5 elements",
      "20 min — Peer showcase + save to pen-drive + group photo at the centre's veranda",
    ],
    whatToBring: [
      "Your laptop with VS Code pre-installed",
      "A pen-drive (≥4 GB) with starter HTML files (Assamese + English)",
      "A simple printed cheat-sheet of tags — we'll email a bilingual PDF by Friday",
    ],
    culturalNotes: [
      "Most kids are first-generation literate — offer Assamese explanations whenever you use an English term.",
      "Use first names warmly. 'Baidew' or 'Anjali baidew' will feel natural to them.",
      "Cameras on phones are OK but ask the centre coordinator before posting any photos online.",
    ],
    safety: [
      "The centre is a first-floor walk-up off Pan Bazaar; the gate shuts at 7 PM.",
      "For any incident, call Brahmaputra Trust coordinator Manashi: +91 376-XXX-00912.",
      "Session is supervised — a staff teacher will be in the room throughout.",
    ],
    route: {
      mode: "City bus + walk",
      distanceKm: 4.6,
      etaMin: 24,
      landmarks: [
        "Zoo Road (your stop)",
        "ASTC bus to Paltan Bazaar",
        "5-min walk via MG Road to Pan Bazaar centre",
      ],
    },
  },
  inc_dhemaji: {
    needId: "inc_dhemaji",
    prep: [
      "Check your personal safety gear (gum-boots, raincoat, flashlight, mosquito repellent).",
      "Review the disaster mobilization protocol for Red severity incidents.",
      "Ensure your phone is fully charged and you have a power bank — Dhemaji towers are intermittent.",
    ],
    whatToBring: [
      "Personal ID and SevaSetu digital ID card",
      "Emergency first-aid kit",
      "Water bottle and dry energy snacks (chura/laru) for 6 hours",
    ],
    culturalNotes: [
      "Dhemaji is a sensitive border zone; follow local authorities' instructions without question.",
      "Respect local customs when entering Mishing relief camps — remove footwear at the namghar.",
    ],
    safety: [
      "Do not enter water deeper than knee level without a life jacket.",
      "Report to the DEOC Dhemaji staging area for your specific assignment.",
      "Maintain radio/phone silence unless reporting an emergency.",
    ],
    route: {
      mode: "Emergency transit (NDRF convoy)",
      distanceKm: 18.2,
      etaMin: 45,
      landmarks: [
        "Starting from Staging Area A (Silapathar)",
        "NH-15 (restricted access)",
        "Dhemaji town gate",
      ],
    },
  },
}

// ----- The current user's match history --------------------------------
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
    reviewText:
      "Anjali baidew organised an entire Majuli cleanup pod herself. Hope she comes back next month.",
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

// ----- A live incident for the Disaster Command Center (session 4) ------
export const activeIncident: Incident = {
  id: "inc_dhemaji",
  type: "flood",
  title: "Dhemaji district · Brahmaputra flood",
  epicenter: { lat: 27.4836, lng: 94.5824, label: "Dhemaji, Assam" },
  radiusKm: 180,
  severity: "critical",
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

// ----- Government / Disaster Cell NGO for incidents ---------------------
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
  about: "The primary response agency for Dhemaji district along the Brahmaputra basin.",
}

export const incidentOperator = {
  name: "Aarti Phukan, IAS",
  role: "Incident Commander",
  region: "Dhemaji District",
  office: "DDMA · Dhemaji",
  badgeId: "DDMA-9921",
}

// ----- Helpers ----------------------------------------------------------
export function getNeedById(id: string): Need | undefined {
  const found = needs.find((n) => n.id === id)
  if (found) return found

  // If it's an incident, convert to a Need-like object for the UI
  if (id === activeIncident.id) {
    return {
      id: activeIncident.id,
      ngoId: "n_govt",
      title: activeIncident.title,
      description: `Active ${activeIncident.type} incident on the Brahmaputra. Emergency responders needed immediately for ${activeIncident.skillsNeeded.map((s) => s.skill).join(", ")}.`,
      skillsRequired: activeIncident.skillsNeeded.map((s) => s.skill),
      startTime: activeIncident.activatedAt,
      durationHours: 12,
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
