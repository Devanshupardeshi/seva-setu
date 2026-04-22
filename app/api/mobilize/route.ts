import { NextResponse } from "next/server"
import adminApp from "@/lib/firebase/admin"
import { getFirestore } from "firebase-admin/firestore"
import { getMessaging } from "firebase-admin/messaging"

export async function POST(req: Request) {
  try {
    const { incidentId, volunteerIds, messageTemplate } = await req.json()

    if (!incidentId || !volunteerIds || !Array.isArray(volunteerIds) || !messageTemplate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const app = adminApp
    if (!app) {
      return NextResponse.json({ error: "Firebase Admin not initialized" }, { status: 500 })
    }

    const db = getFirestore(app)
    const messaging = getMessaging(app)

    // Fetch volunteer details to get phone numbers and FCM tokens
    const volunteerDocs = await Promise.all(
      volunteerIds.map((id) => db.collection("volunteers").doc(id).get())
    )

    const volunteers = volunteerDocs
      .filter((doc) => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() } as any))

    const results = {
      fcm: { success: 0, failed: 0 },
      inbox: { success: 0, failed: 0 },
    }

    const dispatchPromises = volunteers.map(async (volunteer) => {
      const p: Promise<void>[] = []
      const msg = messageTemplate.replace("{{name}}", volunteer.name || "Volunteer")

      // 1. Send FCM Push Notification if token exists
      if (volunteer.fcmToken) {
        const fcmPromise = messaging
          .send({
            token: volunteer.fcmToken,
            notification: {
              title: "SevaSetu Alert",
              body: msg,
            },
            data: {
              incidentId,
            },
          })
          .then(() => {
            results.fcm.success++
          })
          .catch((err: any) => {
            console.error(`FCM failed for ${volunteer.id}:`, err)
            results.fcm.failed++
          })
        p.push(fcmPromise)
      } else {
        results.fcm.failed++
      }

      // 2. Fallback: Save to Firestore Inbox
      const inboxPromise = db.collection("volunteers").doc(volunteer.id).collection("notifications").add({
        title: "SevaSetu Alert",
        body: msg,
        incidentId,
        createdAt: new Date().toISOString(),
        read: false,
        type: "mobilization"
      }).then(() => {
        results.inbox.success++
      }).catch((err: any) => {
        console.error(`Inbox save failed for ${volunteer.id}:`, err)
        results.inbox.failed++
      })
      p.push(inboxPromise)

      await Promise.allSettled(p)
    })

    await Promise.all(dispatchPromises)

    // Update incident progress in Firestore
    await db.collection("incidents").doc(incidentId).update({
      mobilizedCount: volunteerIds.length,
      lastMobilizedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Mobilized ${volunteerIds.length} volunteers`,
      results,
    })
  } catch (error: any) {
    console.error("Mobilization error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}
