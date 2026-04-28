/**
 * Firebase JS SDK client (browser-side).
 *
 * Lazy + null-safe. Returns `null` for every service when the public
 * Firebase env vars are not configured, so the app can still render in
 * Demo Mode without throwing on import.
 *
 * Prefer the getter functions (`getFirebaseApp`, `getFirebaseAuth`,
 * `getFirebaseDb`, `getFirebaseStorage`) — they each return `null`
 * when Firebase is not configured. Callers must handle the null case.
 *
 * The legacy named exports `auth`, `db`, `storage` are preserved for
 * backwards compatibility but should be considered deprecated.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
  )
}

let _app: FirebaseApp | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (_app) return _app
  if (!isFirebaseConfigured()) return null
  try {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  } catch (err) {
    console.warn("[Firebase] Failed to initialize app:", err)
    return null
  }
  return _app
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp()
  if (!app) return null
  try {
    return getAuth(app)
  } catch {
    return null
  }
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp()
  if (!app) return null
  try {
    return getFirestore(app)
  } catch {
    return null
  }
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp()
  if (!app) return null
  try {
    return getStorage(app)
  } catch {
    return null
  }
}

// Legacy compatibility exports — prefer the getters above.
// These are evaluated lazily at first import; if Firebase isn't configured
// they will be `null` and consumers must guard accordingly.
export const app = getFirebaseApp()
export const auth = getFirebaseAuth() as Auth
export const db = getFirebaseDb() as Firestore
export const storage = getFirebaseStorage() as FirebaseStorage

export { RecaptchaVerifier, signInWithPhoneNumber }
export default app
