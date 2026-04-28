"use client"

/**
 * App Mode (Demo / Actual) — client-side context.
 *
 * Source of truth (in order of precedence):
 *   1. localStorage  ("seva-setu-mode")
 *   2. cookie         ("app-mode")
 *   3. default        ("demo")
 *
 * Whenever the mode changes we:
 *   - persist to localStorage
 *   - write the cookie (so SSR + middleware can see it)
 *   - dispatch a custom event ("seva-setu:mode-change") so other tabs / hooks
 *     can react to the switch.
 */

import * as React from "react"

export type AppMode = "demo" | "actual"

const STORAGE_KEY = "seva-setu-mode"
const COOKIE_KEY = "app-mode"
const EVENT_NAME = "seva-setu:mode-change"

type ModeContextValue = {
  mode: AppMode
  setMode: (mode: AppMode) => void
  toggleMode: () => void
  isDemo: boolean
  isActual: boolean
  /** True until the client has hydrated from localStorage (avoid SSR mismatch). */
  hydrated: boolean
}

const ModeContext = React.createContext<ModeContextValue | null>(null)

function readInitialMode(): AppMode {
  if (typeof window === "undefined") return "demo"
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "actual" || stored === "demo") return stored
    const match = document.cookie.match(/app-mode=(actual|demo)/)
    if (match) return match[1] as AppMode
  } catch {
    // ignore (private mode etc.)
  }
  return "demo"
}

function writeCookie(mode: AppMode) {
  if (typeof document === "undefined") return
  // 30-day cookie, lax — readable by middleware & route handlers.
  document.cookie = `${COOKIE_KEY}=${mode}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  // We start in "demo" on the server to keep markup stable, then sync after mount.
  const [mode, setModeState] = React.useState<AppMode>("demo")
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    const initial = readInitialMode()
    setModeState(initial)
    setHydrated(true)
    // Ensure the cookie matches localStorage (in case only one was set).
    writeCookie(initial)

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "demo" || e.newValue === "actual")) {
        setModeState(e.newValue)
      }
    }
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<AppMode>).detail
      if (detail === "demo" || detail === "actual") setModeState(detail)
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(EVENT_NAME, onCustom as EventListener)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(EVENT_NAME, onCustom as EventListener)
    }
  }, [])

  const setMode = React.useCallback((next: AppMode) => {
    setModeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
    writeCookie(next)
    window.dispatchEvent(new CustomEvent<AppMode>(EVENT_NAME, { detail: next }))
  }, [])

  const toggleMode = React.useCallback(() => {
    setMode(mode === "demo" ? "actual" : "demo")
  }, [mode, setMode])

  const value = React.useMemo<ModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
      isDemo: mode === "demo",
      isActual: mode === "actual",
      hydrated,
    }),
    [mode, setMode, toggleMode, hydrated],
  )

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>
}

export function useAppMode(): ModeContextValue {
  const ctx = React.useContext(ModeContext)
  if (!ctx) {
    throw new Error("useAppMode must be used inside <ModeProvider>")
  }
  return ctx
}

/** Convenience alias used throughout the app. */
export const useMode = useAppMode

/**
 * Synchronous read of the current mode without React.
 * Useful inside the api-client and other non-React modules.
 */
export function getCurrentMode(): AppMode {
  return readInitialMode()
}

export const APP_MODE_HEADER = "x-app-mode"
export const APP_MODE_COOKIE = COOKIE_KEY
export const APP_MODE_STORAGE_KEY = STORAGE_KEY
export const APP_MODE_EVENT = EVENT_NAME
