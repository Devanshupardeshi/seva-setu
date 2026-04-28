/**
 * Server-side fixtures used by Demo Mode handlers. These are intentionally
 * decoupled from the frontend mock data so the backend has stable, predictable
 * sample payloads even if the UI mock data evolves.
 */

export const demoVolunteerProfile = {
  name: "Priya Sharma",
  skills: ["Teaching", "Math", "Science"],
  languages: ["Hindi", "English", "Marathi"],
  availability: ["sat", "sun"],
  experience: "professional" as const,
  remoteOk: false,
}

export const demoParsedNeed = {
  title: "Math Tutor for Grade 8 Students",
  skills: ["Math", "Teaching"],
  languages: ["Hindi", "English"],
  date: "This Saturday",
  time: "3:00 - 5:00 PM",
  duration: "2 hours",
  location: "Bandra, Mumbai",
  urgency: "priority",
  slots: 3,
  summary: "",
}

export const demoMatches = [
  { id: "v_priya", distance: 0.92 },
  { id: "v_rahul", distance: 0.86 },
  { id: "v_anita", distance: 0.81 },
  { id: "v_kiran", distance: 0.77 },
  { id: "v_sneha", distance: 0.72 },
]

export const demoBriefing = {
  prep: [
    "Review the Grade 8 NCERT Math syllabus, especially Algebra basics.",
    "Prepare a short ice-breaker activity to make students comfortable.",
    "Bring printed practice worksheets if possible.",
  ],
  lessonPlan: [
    "10 min — introductions and expectations",
    "30 min — concept review with examples",
    "40 min — guided practice and Q&A",
    "10 min — wrap-up and homework",
  ],
  whatToBring: ["Government photo ID", "Notebook & pens", "Reusable water bottle"],
  culturalNotes: [
    "Greet beneficiaries respectfully and use simple, encouraging language.",
    "Avoid discussing personal background or socio-economic status of students.",
  ],
  safety: [
    "Stay within the designated session area at the centre.",
    "Do not exchange personal contact information with minors.",
    "Report any safeguarding concerns to the NGO coordinator immediately.",
  ],
}

export const demoCsrReport = {
  title: "Annual CSR Impact Report — SevaSetu Partnership",
  summary:
    "This report summarises the social impact delivered through SevaSetu over the reporting period, focusing on volunteer hours mobilised, beneficiaries reached, and alignment with the United Nations Sustainable Development Goals.",
  sdgs: ["SDG 4: Quality Education", "SDG 10: Reduced Inequalities", "SDG 17: Partnerships for the Goals"],
  metrics: [
    { label: "Volunteer Hours", value: "1,240" },
    { label: "Beneficiaries Reached", value: "3,580" },
    { label: "Active Volunteers", value: "186" },
    { label: "NGO Partners", value: "12" },
  ],
  story:
    "A cohort of professional volunteers delivered weekend tutoring sessions for Grade 8 students in Bandra, Mumbai. Over twelve weeks, average mathematics scores improved by 22% and student attendance grew from 64% to 91%.",
  complianceNote:
    "All activities reported here are eligible CSR activities under Schedule VII of Section 135 of the Companies Act 2013 and have been independently verified by the partner NGO.",
}

export const demoMobilizeResults = {
  fcm: { success: 4, failed: 1 },
  inbox: { success: 5, failed: 0 },
}
