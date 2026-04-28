/**
 * SevaSetu — full database setup script.
 *
 * One-shot bootstrap that:
 *   1. Creates real Firebase Auth users (volunteer, NGO admin, coordinator,
 *      corporate) with email/password credentials you can sign in with.
 *   2. Sets a `role` custom claim on each user so the UI + proxy.ts know
 *      which dashboard they belong to.
 *   3. Writes the canonical role lookup at `users/{uid}` and the role-
 *      specific profile at `volunteers/{uid}` or `ngos/{uid}`.
 *   4. Seeds every public Firestore collection (volunteers, ngos, needs,
 *      matches, incidents, briefings) with the Brahmaputra-themed mock
 *      fixtures, so Actual Mode has data to display from minute one.
 *
 * Usage (from project root):
 *   1. Create .env.local with these vars (same ones Vercel uses):
 *        NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 *        FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@<project>.iam.gserviceaccount.com
 *        FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *   2. Run:
 *        node scripts/seed-full.js
 *
 * Re-running is safe — every write uses { merge: true } / upserts on Auth.
 *
 * Edit the USERS array below to add your own real accounts.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const { getFirestore } = require("firebase-admin/firestore")
const fs = require("fs")
const path = require("path")

// ---- Manual .env.local loader ------------------------------------------
// We do this by hand so the script works even if `dotenv` isn't installed.
;(function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local")
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, "utf8")
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) return
    const i = trimmed.indexOf("=")
    if (i === -1) return
    const key = trimmed.substring(0, i).trim()
    let val = trimmed.substring(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.substring(1, val.length - 1)
    }
    if (!process.env[key]) process.env[key] = val.replace(/\\n/g, "\n")
  })
})()

// ----------------------------------------------------------------------
// Firebase Auth users to provision.
// Edit these to whatever credentials you want to log in with.
// ----------------------------------------------------------------------
const USERS = [
  {
    email: "volunteer@sevasetu.test",
    password: "Volunteer@123",
    role: "volunteer",
    displayName: "Anjali Borah",
    profileDocId: "v_priya", // Match the volunteer ID used in mock-data.ts
    profile: {
      phone: "+91 98XXX 41203",
      location: { label: "Zoo Road, Guwahati", lat: 26.1445, lng: 91.7362 },
      languages: ["Assamese", "Hindi", "English", "Bengali"],
      skills: [
        "Teaching",
        "Assamese translation",
        "First aid",
        "Boat handling",
        "Public speaking",
        "Digital literacy",
      ],
      availability: ["sat", "sun"],
      experience: "student",
      remoteOk: true,
      trustScore: 4.8,
      hoursGiven: 48,
      peopleHelped: 63,
      projectsCompleted: 9,
      joinedAt: "2025-11-02",
    },
  },
  {
    email: "ngo@sevasetu.test",
    password: "Ngo@12345",
    role: "ngo",
    displayName: "Brahmaputra Education Trust",
    profileDocId: "n_shiksha",
    profile: {
      darpanId: "AS/2021/0304512",
      verified: true,
      location: { label: "Pan Bazaar, Guwahati", lat: 26.1158, lng: 91.7086 },
      focusAreas: ["Education", "Digital literacy"],
      rating: 4.9,
      volunteersActive: 128,
      since: "2014",
      about:
        "Weekend learning centres for 200+ flood-affected children across Guwahati's char settlements.",
    },
  },
  {
    email: "coordinator@sevasetu.test",
    password: "Coord@1234",
    role: "ngo",
    displayName: "Manashi Hazarika",
    profileDocId: "c_meena",
    profile: {
      darpanId: "AS/2021/0304512",
      role: "Programme Coordinator",
      ngoId: "n_shiksha",
      location: { label: "Pan Bazaar, Guwahati", lat: 26.1158, lng: 91.7086 },
    },
  },
]

// ----------------------------------------------------------------------
// Firestore mock fixtures (Brahmaputra basin, Assam).
// Mirrors frontend/lib/mock-data.ts so Actual Mode renders real data.
// ----------------------------------------------------------------------
const VOLUNTEERS = [
  {
    id: "v_priya",
    name: "Anjali Borah",
    phone: "+91 98XXX 41203",
    avatarUrl: "/images/priya-avatar.jpg",
    location: { lat: 26.1445, lng: 91.7362, label: "Zoo Road, Guwahati" },
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
  },
]

const NGOS = [
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
      "Weekend learning centres for 200+ flood-affected children across Guwahati's char settlements.",
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
      "Rapid Brahmaputra flood relief across Dhemaji, Lakhimpur, Majuli and Morigaon.",
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
      "Free Assamese-language mental-health helpline + camps across Sonitpur and Darrang.",
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
    about: "Riverbank erosion mapping and bamboo embankment building on Majuli.",
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
      "Skill training for 3,000+ Mishing and tea-garden women across Upper Assam.",
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
      "Surplus-food rescue redistributing 8,000+ meals weekly to flood relief camps.",
  },
]

const NEEDS = [
  {
    id: "need_html",
    ngoId: "n_shiksha",
    title: "Teach digital literacy to 10 char-school kids",
    description:
      "Saturday workshop for 10–12 year olds at our Pan Bazaar centre. 5 laptops available. Help kids — most from chars displaced by the last Brahmaputra flood — build their first webpage in Assamese.",
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
      "Strong fit: teaching + digital literacy + Assamese + nearby.",
  },
  {
    id: "need_translate",
    ngoId: "n_goonj",
    title: "Remote: Assamese ↔ English translation · flood reports",
    description:
      "Translate field reports from Dhemaji and Lakhimpur teams for the central coordination cell. Fully remote, 3-hour block.",
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
    matchReason: "Returning Goonj volunteer with Assamese translation skill.",
  },
  {
    id: "need_helpline",
    ngoId: "n_arogya",
    title: "Evening helpline listener · Assamese",
    description:
      "Two-hour empathetic listening shift for flood-displaced families. Training included.",
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
    matchReason: "Public-speaking + Assamese fluency = strong cultural fit.",
  },
  {
    id: "need_beach",
    ngoId: "n_green",
    title: "Brahmaputra riverbank cleanup · Sunday dawn",
    description:
      "6 AM cleanup along the Majuli ghat. Bags, gloves and breakfast (jolpan + tea) provided.",
    skillsRequired: ["Physical activity"],
    startTime: "2026-04-26T06:00:00+05:30",
    durationHours: 3,
    location: { lat: 26.9527, lng: 94.1709, label: "Garmur Ghat, Majuli" },
    urgency: "routine",
    slots: 20,
    filled: 14,
    tags: ["environment"],
    matchScore: 64,
    matchReason: "Group-friendly weekend gig.",
  },
  {
    id: "need_poster",
    ngoId: "n_disha",
    title: "One-time: Bihu posters for Mishing weavers' co-op",
    description:
      "Remote design brief for 4 Bihu posters showcasing Mishing handloom weavers. 5-day turnaround.",
    skillsRequired: ["Graphic design", "Digital literacy"],
    startTime: "2026-04-28T10:00:00+05:30",
    durationHours: 6,
    location: { lat: 27.4728, lng: 94.9119, label: "Remote" },
    urgency: "routine",
    slots: 2,
    filled: 0,
    tags: ["design", "remote", "women-only"],
    matchScore: 88,
    matchReason: "Digital-design chops + first-time-designer preference.",
  },
]

const MATCHES = [
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
    reviewText: "Anjali baidew organised an entire Majuli cleanup pod herself.",
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

const INCIDENT = {
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

// ----------------------------------------------------------------------
function getCreds() {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n",
  )

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "\n[seed-full] Missing Firebase Admin credentials.\n" +
        "Set the following in .env.local at the project root:\n" +
        "  NEXT_PUBLIC_FIREBASE_PROJECT_ID\n" +
        "  FIREBASE_CLIENT_EMAIL\n" +
        '  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"\n',
    )
    process.exit(1)
  }
  return { projectId, clientEmail, privateKey }
}

async function ensureUser(auth, db, spec) {
  let userRecord
  try {
    userRecord = await auth.getUserByEmail(spec.email)
    await auth.updateUser(userRecord.uid, {
      password: spec.password,
      displayName: spec.displayName,
      emailVerified: true,
    })
    console.log(`  [updated] ${spec.email}  uid=${userRecord.uid}`)
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err
    userRecord = await auth.createUser({
      email: spec.email,
      password: spec.password,
      displayName: spec.displayName,
      emailVerified: true,
    })
    console.log(`  [created] ${spec.email}  uid=${userRecord.uid}`)
  }

  await auth.setCustomUserClaims(userRecord.uid, { role: spec.role })

  const now = new Date().toISOString()
  await db
    .collection("users")
    .doc(userRecord.uid)
    .set(
      {
        uid: userRecord.uid,
        email: spec.email,
        role: spec.role,
        displayName: spec.displayName,
        createdAt: now,
      },
      { merge: true },
    )

  // Role-specific profile doc.
  const collection = spec.role === "volunteer" ? "volunteers" : "ngos"
  await db
    .collection(collection)
    .doc(spec.profileDocId || userRecord.uid)
    .set(
      {
        id: spec.profileDocId || userRecord.uid,
        uid: userRecord.uid,
        email: spec.email,
        name: spec.displayName,
        ...(spec.profile || {}),
        createdAt: now,
      },
      { merge: true },
    )
}

async function seedCollection(db, name, docs) {
  console.log(`  Seeding ${docs.length} doc(s) → ${name}/`)
  const now = new Date().toISOString()
  await Promise.all(
    docs.map((doc) =>
      db
        .collection(name)
        .doc(doc.id)
        .set({ ...doc, createdAt: doc.createdAt || now }, { merge: true }),
    ),
  )
}

async function main() {
  const { projectId, clientEmail, privateKey } = getCreds()

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
  }

  const auth = getAuth()
  const db = getFirestore()

  console.log(`\n=== SevaSetu full seed → project "${projectId}" ===\n`)

  console.log("[1/2] Provisioning Firebase Auth users…")
  for (const spec of USERS) {
    await ensureUser(auth, db, spec)
  }

  console.log("\n[2/2] Seeding Firestore collections…")
  await seedCollection(db, "volunteers", VOLUNTEERS)
  await seedCollection(db, "ngos", NGOS)
  await seedCollection(db, "needs", NEEDS)
  await seedCollection(db, "matches", MATCHES)
  await seedCollection(db, "incidents", [INCIDENT])

  console.log("\nDone. Sign in at /login (after switching to Actual Mode) with:\n")
  for (const u of USERS) {
    console.log(
      `  ${u.role.padEnd(10)} ${u.email.padEnd(32)} ${u.password}`,
    )
  }
  console.log("")
  process.exit(0)
}

main().catch((err) => {
  console.error("\n[seed-full] Failed:", err)
  process.exit(1)
})
