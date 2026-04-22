import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const serviceAccount = {
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

const adminApp =
  getApps().length === 0
    ? (serviceAccount.project_id && serviceAccount.client_email && serviceAccount.private_key
      ? initializeApp({ credential: cert(serviceAccount as any) })
      : null)
    : getApps()[0]

export const adminAuth = adminApp ? getAuth(adminApp) : null as any
export const adminDb = adminApp ? getFirestore(adminApp) : null as any
export default adminApp
