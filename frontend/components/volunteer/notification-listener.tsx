"use client"

import { useEffect } from "react"
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { currentVolunteer } from "@/lib/mock-data"
import { toast } from "sonner"

export function NotificationListener() {
  useEffect(() => {
    if (!currentVolunteer.id) return

    // Listen to notifications collection for this volunteer
    const q = query(
      collection(db, "volunteers", currentVolunteer.id, "notifications"),
      orderBy("createdAt", "desc"),
      limit(5)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date().getTime()
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data()
          const createdAt = new Date(data.createdAt).getTime()
          
          // Only show toast if notification is newer than 2 minutes
          // This prevents old notifications from appearing as toasts on page load
          // while still allowing very recent notifications to show up.
          if (now - createdAt < 120000) {
            toast(data.title || "New Notification", {
              description: data.body,
              action: data.incidentId ? {
                label: "View",
                onClick: () => window.location.href = `/volunteer/matches/${data.incidentId}`
              } : undefined
            })
          }
        }
      })
    })

    return () => unsubscribe()
  }, [])

  return null
}
