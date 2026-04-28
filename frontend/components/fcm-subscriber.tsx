"use client"

import { useEffect } from "react"
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging"
import { getFirebaseApp } from "@/lib/firebase/client"
import { toast } from "sonner"
import { useMode } from "@/frontend/lib/mode/mode-context"

/**
 * Foreground FCM subscriber. Only initialises in Actual Mode and only when:
 *   - We are running in a browser
 *   - Firebase is configured (NEXT_PUBLIC_FIREBASE_* env vars present)
 *   - The browser supports the FCM messaging APIs
 */
export function FCMSubscriber() {
  const { mode } = useMode()

  useEffect(() => {
    if (mode !== "actual") return
    if (typeof window === "undefined") return
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return

    let unsub: (() => void) | undefined
    let cancelled = false

    const initFCM = async () => {
      try {
        const supported = await isSupported().catch(() => false)
        if (!supported || cancelled) return

        const app = getFirebaseApp()
        if (!app) return

        const messaging = getMessaging(app)

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        if (vapidKey) {
          const token = await getToken(messaging, { vapidKey }).catch((err) => {
            console.warn("[FCM] push token not acquired:", err)
            return null
          })
          if (token) {
            // In a real app, persist this token against the user's profile.
            console.log("[FCM] push token registered")
          }
        }

        unsub = onMessage(messaging, (payload) => {
          if (payload.notification) {
            toast(payload.notification.title || "SevaSetu Alert", {
              description: payload.notification.body,
            })
          }
        })
      } catch (err) {
        console.warn("[FCM] initialization skipped:", err)
      }
    }

    initFCM()

    return () => {
      cancelled = true
      if (unsub) unsub()
    }
  }, [mode])

  return null
}
