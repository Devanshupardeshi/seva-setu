"use client"

import { useEffect } from "react"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import app from "@/lib/firebase/client"
import { toast } from "sonner"

export function FCMSubscriber() {
  useEffect(() => {
    const initFCM = async () => {
      // Return early if we don't have the required config (or if we are not in browser)
      if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return

      try {
        const messaging = getMessaging(app)

        // Attempt to get token (this requires a valid VAPID key in a real prod env)
        const token = await getToken(messaging, {
          // vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        }).catch((err) => {
          console.warn("[FCM] VAPID push token not acquired (expected if no key configured):", err)
          return null
        })

        if (token) {
          console.log("[FCM] Push token registered:", token)
          // In a real app, we would save this token to the volunteer's document in Firestore here.
        }

        // Subscribe to foreground messages
        onMessage(messaging, (payload) => {
          console.log("[FCM] Message received in foreground:", payload)
          if (payload.notification) {
            toast(payload.notification.title || "SevaSetu Alert", {
              description: payload.notification.body,
            })
          }
        })
      } catch (err) {
        console.warn("[FCM] Initialization failed/skipped.", err)
      }
    }

    initFCM()
  }, [])

  return null
}
