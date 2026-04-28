import type { Volunteer } from "./types"
import { currentVolunteer, ngos, needs } from "./mock-data"

// ----- The currently logged-in NGO coordinator --------------------------
export const currentNgo = ngos[0] // Brahmaputra Education Trust

export const currentCoordinator = {
  id: "c_meena",
  name: "Manashi Hazarika",
  role: "Programme Coordinator",
  phone: "+91 376-XXX-00912",
  ngoId: currentNgo.id,
}

// ----- Applicants for the open digital-literacy need --------------------
// Ranked by the matching engine (semantic fit + distance + trust).

export type Applicant = {
  volunteer: Pick<
    Volunteer,
    | "id"
    | "name"
    | "avatarUrl"
    | "location"
    | "skills"
    | "languages"
    | "trustScore"
    | "hoursGiven"
    | "peopleHelped"
    | "projectsCompleted"
    | "experience"
  >
  matchScore: number
  distanceKm: number
  availability: "confirmed" | "tentative"
  whyMatched: string
  status: "new" | "shortlisted" | "messaged" | "declined"
  appliedAt: string
}

export const applicantsByNeedId: Record<string, Applicant[]> = {
  need_html: [
    {
      volunteer: {
        id: currentVolunteer.id,
        name: currentVolunteer.name,
        avatarUrl: currentVolunteer.avatarUrl,
        location: currentVolunteer.location,
        skills: currentVolunteer.skills,
        languages: currentVolunteer.languages,
        trustScore: currentVolunteer.trustScore,
        hoursGiven: currentVolunteer.hoursGiven,
        peopleHelped: currentVolunteer.peopleHelped,
        projectsCompleted: currentVolunteer.projectsCompleted,
        experience: currentVolunteer.experience,
      },
      matchScore: 96,
      distanceKm: 4.6,
      availability: "confirmed",
      whyMatched:
        "Has run two prior teaching gigs, speaks Assamese + Hindi + English, and lives 4.6 km away on Zoo Road. Strong reliability history.",
      status: "shortlisted",
      appliedAt: "2026-04-20T09:14:00+05:30",
    },
    {
      volunteer: {
        id: "v_arjun",
        name: "Bhaskar Saikia",
        location: { lat: 26.1809, lng: 91.7531, label: "Beltola, Guwahati" },
        skills: ["Teaching", "JavaScript", "Robotics"],
        languages: ["Assamese", "Hindi", "English"],
        trustScore: 4.6,
        hoursGiven: 62,
        peopleHelped: 90,
        projectsCompleted: 12,
        experience: "professional",
      },
      matchScore: 91,
      distanceKm: 7.2,
      availability: "confirmed",
      whyMatched:
        "Senior engineer at an IT firm in Guwahati, runs a school robotics club on weekends. Will build strong Assamese rapport with the cohort.",
      status: "new",
      appliedAt: "2026-04-20T11:02:00+05:30",
    },
    {
      volunteer: {
        id: "v_sara",
        name: "Sahnaz Khanam",
        location: { lat: 26.1090, lng: 91.7263, label: "Fancy Bazaar, Guwahati" },
        skills: ["UI design", "Illustration", "Teaching"],
        languages: ["Assamese", "Hindi", "Bengali", "English"],
        trustScore: 4.4,
        hoursGiven: 24,
        peopleHelped: 31,
        projectsCompleted: 4,
        experience: "early-career",
      },
      matchScore: 84,
      distanceKm: 1.4,
      availability: "confirmed",
      whyMatched:
        "Walks from Fancy Bazaar (1.4 km). Illustration background means kids will enjoy the visuals.",
      status: "new",
      appliedAt: "2026-04-20T12:47:00+05:30",
    },
    {
      volunteer: {
        id: "v_rohan",
        name: "Rohan Bordoloi",
        location: { lat: 26.1445, lng: 91.7362, label: "Zoo Road, Guwahati" },
        skills: ["Python", "Data science", "Mentoring"],
        languages: ["Assamese", "Hindi", "English", "Bengali"],
        trustScore: 4.3,
        hoursGiven: 18,
        peopleHelped: 22,
        projectsCompleted: 3,
        experience: "student",
      },
      matchScore: 78,
      distanceKm: 4.6,
      availability: "tentative",
      whyMatched:
        "First-time HTML teacher, but has mentored 3 cohorts of Python beginners at IIT Guwahati. Might need a co-teacher.",
      status: "new",
      appliedAt: "2026-04-20T14:10:00+05:30",
    },
    {
      volunteer: {
        id: "v_neha",
        name: "Nilakshi Pathak",
        location: { lat: 26.1825, lng: 91.7368, label: "Six Mile, Guwahati" },
        skills: ["Teaching", "Content writing"],
        languages: ["Assamese", "English"],
        trustScore: 4.7,
        hoursGiven: 54,
        peopleHelped: 70,
        projectsCompleted: 10,
        experience: "professional",
      },
      matchScore: 72,
      distanceKm: 5.3,
      availability: "tentative",
      whyMatched:
        "Seasoned teacher with strong reliability, but limited digital-design background — better for an English module.",
      status: "new",
      appliedAt: "2026-04-20T15:31:00+05:30",
    },
    {
      volunteer: {
        id: "v_karan",
        name: "Karan Mech",
        location: { lat: 26.7509, lng: 94.2037, label: "Jorhat" },
        skills: ["HTML", "CSS", "Photography"],
        languages: ["Assamese", "Hindi", "English"],
        trustScore: 3.9,
        hoursGiven: 6,
        peopleHelped: 8,
        projectsCompleted: 1,
        experience: "student",
      },
      matchScore: 61,
      distanceKm: 308.0,
      availability: "tentative",
      whyMatched:
        "Strong on tech skills but 308 km away in Jorhat and has had one prior no-show — consider as a remote co-teacher only.",
      status: "new",
      appliedAt: "2026-04-20T17:05:00+05:30",
    },
  ],
}

// ----- Needs owned by the current NGO ----------------------------------
export const myNeeds = needs.filter((n) => n.ngoId === currentNgo.id)

// Add a couple of additional NGO-owned needs for the dashboard to feel real.
export const extendedMyNeeds = [
  ...myNeeds,
  {
    id: "need_math",
    ngoId: currentNgo.id,
    title: "Saturday math circle · Class 6 level (char school)",
    description:
      "Ongoing 4-week math circle for kids from Guwahati's char settlements. Covers fractions, ratios and basic algebra with games. Looking for one lead and one co-teacher.",
    skillsRequired: ["Teaching", "Math"],
    languagesPreferred: ["Assamese", "Hindi", "English"],
    startTime: "2026-05-02T10:00:00+05:30",
    durationHours: 2,
    location: currentNgo.location,
    urgency: "routine" as const,
    slots: 2,
    filled: 0,
    matchScore: 0,
    matchReason: "",
  },
  {
    id: "need_poster_shk",
    ngoId: currentNgo.id,
    title: "Bohag Bihu: design 3 Instagram posts",
    description:
      "One-time design brief for Bohag Bihu social media. Turnaround: 4 days. Brand guidelines (Assamese typography pack) provided on acceptance.",
    skillsRequired: ["Graphic design"],
    startTime: "2026-04-30T10:00:00+05:30",
    durationHours: 4,
    location: { ...currentNgo.location, label: "Remote" },
    urgency: "routine" as const,
    slots: 1,
    filled: 0,
    matchScore: 0,
    matchReason: "",
  },
]

// ----- Dashboard stats for Brahmaputra Education Trust -----------------
export const ngoStats = {
  openNeeds: extendedMyNeeds.length,
  applicantsWaiting: 11,
  hoursThisMonth: 214,
  childrenReachedThisMonth: 186,
  repeatVolunteers: 34,
  avgTimeToFill: "14 min",
}

// ----- Recent completed activity for the dashboard --------------------
export const recentCompleted = [
  {
    id: "rc_1",
    title: "Saturday math circle (Week 3)",
    volunteer: "Tanvi Senapati",
    date: "2026-04-12",
    rating: 5,
    note: "Brought handmade flashcards in Assamese. Kids asked to keep them.",
  },
  {
    id: "rc_2",
    title: "English reading corner",
    volunteer: "Bhaskar Saikia",
    date: "2026-04-06",
    rating: 5,
    note: "Quiet but very patient. Will invite again.",
  },
  {
    id: "rc_3",
    title: "Bihu poster design",
    volunteer: "Sahnaz Khanam",
    date: "2026-03-30",
    rating: 4,
    note: "Beautiful layouts, turnaround slightly delayed.",
  },
]

// ----- CSR / Impact rollup for the reports page ----------------------
export const impactRollup = {
  periodLabel: "Jan 2026 – Apr 2026",
  totalVolunteers: 128,
  repeatVolunteers: 34,
  totalHours: 614,
  childrenReached: 412,
  sessionsDelivered: 96,
  sdgContribution: [
    { code: "SDG 4", label: "Quality Education", pct: 62 },
    { code: "SDG 10", label: "Reduced Inequalities", pct: 24 },
    { code: "SDG 17", label: "Partnerships", pct: 14 },
  ],
  monthlyHours: [
    { month: "Jan", hours: 128 },
    { month: "Feb", hours: 142 },
    { month: "Mar", hours: 168 },
    { month: "Apr", hours: 176 },
  ],
  topSkills: [
    { skill: "Teaching", hours: 308 },
    { skill: "Digital literacy", hours: 76 },
    { skill: "Math tutoring", hours: 94 },
    { skill: "Assamese reading", hours: 82 },
    { skill: "Graphic design", hours: 54 },
  ],
}
