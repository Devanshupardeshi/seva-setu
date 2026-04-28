/**
 * Server-side App Mode detection.
 *
 * SevaSetu has two operating modes:
 *  - "demo"   → all API routes return safe mock responses; no external calls.
 *               Used for the public demo so reviewers can explore without
 *               provisioning Firebase / Gemini / Vertex AI credentials.
 *  - "actual" → API routes call the real Google Cloud backend (Firebase Admin,
 *               Gemini 2.5 Flash, Vertex AI Vector Search, FCM). Requires the
 *               appropriate environment variables to be set.
 *
 * The mode is communicated from the browser via the `x-app-mode` header
 * (set by frontend/lib/mode/api-client.ts) and falls back to the
 * `app-mode` cookie. If neither is set, we default to "demo".
 */

export type AppMode = "demo" | "actual"

const MODE_HEADER = "x-app-mode"
const MODE_COOKIE = "app-mode"

/**
 * Read the current mode from a Next.js Request.
 * Safe to call from any route handler.
 */
export function getRequestMode(request: Request): AppMode {
  // 1. Header (preferred — sent by api-client on every fetch)
  const headerMode = request.headers.get(MODE_HEADER)
  if (headerMode === "actual" || headerMode === "demo") return headerMode

  // 2. Cookie fallback
  const cookieHeader = request.headers.get("cookie") || ""
  const match = cookieHeader.match(new RegExp(`${MODE_COOKIE}=(actual|demo)`))
  if (match) return match[1] as AppMode

  // 3. Default
  return "demo"
}

/** Convenience helpers */
export function isDemoMode(request: Request): boolean {
  return getRequestMode(request) === "demo"
}

export function isActualMode(request: Request): boolean {
  return getRequestMode(request) === "actual"
}

/**
 * Returns true if the server has the credentials required to operate
 * in "actual" mode for the given service. Useful for graceful fallback
 * when Actual Mode is requested but env vars are missing.
 */
export function hasGeminiCredentials(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

export function hasFirebaseAdminCredentials(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  )
}

export function hasVectorSearchCredentials(): boolean {
  return Boolean(
    process.env.GCP_PROJECT &&
      process.env.VECTOR_INDEX_ENDPOINT &&
      process.env.VECTOR_INDEX_DEPLOYED_ID,
  )
}
