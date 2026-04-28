/**
 * Firebase Admin SDK (server-side).
 *
 * Provides null-safe getters that return `null` if the required service
 * account env vars are missing. API route handlers should call
 * `getAdminApp()` and gracefully fall back to mock responses (or 503)
 * when null. See `backend/config/mode.ts` for mode detection.
 *
 * Required env vars for Actual Mode:
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY  (with literal \n preserved or real newlines)
 */

import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"
import { getMessaging, type Messaging } from "firebase-admin/messaging"

let _app: App | null = null

function getServiceAccount() {
  const project_id = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const client_email = process.env.FIREBASE_CLIENT_EMAIL
  const raw_key = process.env.FIREBASE_PRIVATE_KEY
  if (!project_id || !client_email || !raw_key) return null
  // PRIVATE_KEY may be stored with escaped \n — normalise.
  const private_key = raw_key.replace(/\\n/g, "\n")
  return { project_id, client_email, private_key }
}

export function isAdminConfigured(): boolean {
  return getServiceAccount() !== null
}

export function getAdminApp(): App | null {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]
    return _app
  }
  const sa = getServiceAccount()
  if (!sa) return null
  try {
    _app = initializeApp({ credential: cert(sa as any) })
    return _app
  } catch (err) {
    console.warn("[Firebase Admin] Failed to initialize:", err)
    return null
  }
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp()
  return app ? getAuth(app) : null
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp()
  return app ? getFirestore(app) : null
}

export function getAdminMessaging(): Messaging | null {
  const app = getAdminApp()
  return app ? getMessaging(app) : null
}

// Legacy compatibility exports — prefer the getters above.
export const adminApp = getAdminApp()
export const adminAuth = (adminApp ? getAuth(adminApp) : null) as Auth
export const adminDb = (adminApp ? getFirestore(adminApp) : null) as Firestore
export default adminApp
