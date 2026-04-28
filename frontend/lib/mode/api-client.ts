/**
 * Tiny fetch wrapper that automatically attaches the current App Mode
 * header to every request. All client-side calls into /api/* should go
 * through `apiFetch` so the server can decide between mock and real
 * implementations.
 */

import { APP_MODE_HEADER, getCurrentMode } from "./mode-context"

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  if (!headers.has(APP_MODE_HEADER)) {
    headers.set(APP_MODE_HEADER, getCurrentMode())
  }
  return fetch(input, { ...init, headers })
}
