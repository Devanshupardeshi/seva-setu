/**
 * Provisions a starter set of real Firebase Auth users for SevaSetu.
 *
 * Usage:
 *   node scripts/create-users.js
 *
 * Prerequisites — set these in `.env.local` (same vars Vercel uses):
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 *
 * What it does for each user:
 *   1. Creates (or fetches) the Firebase Auth account.
 *   2. Sets a custom `role` claim ("volunteer" | "ngo").
 *   3. Writes `users/{uid}` (canonical role lookup).
 *   4. Writes the role-specific profile doc (`volunteers/{uid}` / `ngos/{uid}`).
 *
 * Edit the USERS array below to add more.
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app")
const { getAuth } = require("firebase-admin/auth")
const { getFirestore } = require("firebase-admin/firestore")
require("dotenv").config({ path: ".env.local" })

const USERS = [
  {
    email: "volunteer@sevasetu.test",
    password: "Volunteer@123",
    role: "volunteer",
    displayName: "Asha Volunteer",
    profile: {
      location: { label: "Mumbai, MH", lat: 19.076, lng: 72.8777 },
      languages: ["en", "hi", "mr"],
      skills: ["teaching", "first-aid"],
      availability: ["weekend"],
    },
  },
  {
    email: "ngo@sevasetu.test",
    password: "Ngo@12345",
    role: "ngo",
    displayName: "Akshara Foundation",
    profile: {
      darpanId: "MH/2024/000001",
      location: { label: "Mumbai, MH", lat: 19.076, lng: 72.8777 },
      focusArea: "education",
    },
  },
]

function getCreds() {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "\n[create-users] Missing Firebase Admin credentials. Set these in .env.local:\n" +
        "  NEXT_PUBLIC_FIREBASE_PROJECT_ID\n" +
        "  FIREBASE_CLIENT_EMAIL\n" +
        "  FIREBASE_PRIVATE_KEY\n",
    )
    process.exit(1)
  }
  return { projectId, clientEmail, privateKey }
}

async function ensureUser(auth, db, spec) {
  let userRecord
  try {
    userRecord = await auth.getUserByEmail(spec.email)
    console.log(`  [exists]  ${spec.email}  uid=${userRecord.uid}`)
    // Reset password so the credentials in this file always work.
    await auth.updateUser(userRecord.uid, {
      password: spec.password,
      displayName: spec.displayName,
      emailVerified: true,
    })
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

  // Custom claim → carried in every future ID token.
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

  const collection = spec.role === "volunteer" ? "volunteers" : "ngos"
  await db
    .collection(collection)
    .doc(userRecord.uid)
    .set(
      {
        id: userRecord.uid,
        email: spec.email,
        name: spec.displayName,
        ...spec.profile,
        createdAt: now,
      },
      { merge: true },
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

  console.log(`\nProvisioning ${USERS.length} user(s) in Firebase project "${projectId}"\n`)
  for (const spec of USERS) {
    await ensureUser(auth, db, spec)
  }

  console.log("\nDone. You can now sign in at /login with:\n")
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(10)} ${u.email}  /  ${u.password}`)
  }
  console.log("")
  process.exit(0)
}

main().catch((err) => {
  console.error("[create-users] Failed:", err)
  process.exit(1)
})
