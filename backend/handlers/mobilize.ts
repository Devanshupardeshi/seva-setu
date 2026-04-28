import { getAdminApp, isAdminConfigured } from "@/backend/firebase/admin"
import { getFirestore } from "firebase-admin/firestore"
import { getMessaging } from "firebase-admin/messaging"
import { demoMobilizeResults } from "@/backend/mock/fixtures"
import type { Mode } from "@/backend/config/mode"

export type MobilizeResult =
  | {
      ok: true
      mode: Mode
      message: string
      results: { fcm: { success: number; failed: number }; inbox: { success: number; failed: number } }
    }
  | { ok: false; status: number; error: string }

export async function mobilizeVolunteers(
  payload: { incidentId?: string; volunteerIds?: string[]; messageTemplate?: string },
  mode: Mode,
): Promise<MobilizeResult> {
  const { incidentId, volunteerIds, messageTemplate } = payload

  if (!incidentId || !Array.isArray(volunteerIds) || volunteerIds.length === 0 || !messageTemplate) {
    return { ok: false, status: 400, error: "incidentId, volunteerIds[] and messageTemplate are required." }
  }

  if (mode === "demo") {
    return {
      ok: true,
      mode,
      message: `(demo) Mobilized ${volunteerIds.length} volunteers`,
      results: demoMobilizeResults,
    }
  }

  if (!isAdminConfigured()) {
    return { ok: false, status: 503, error: "Firebase Admin is not configured on the server." }
  }

  const app = getAdminApp()
  if (!app) {
    return { ok: false, status: 500, error: "Failed to initialise Firebase Admin." }
  }

  const db = getFirestore(app)
  const messaging = getMessaging(app)

  const results = {
    fcm: { success: 0, failed: 0 },
    inbox: { success: 0, failed: 0 },
  }

  try {
    const volunteerDocs = await Promise.all(
      volunteerIds.map((id) => db.collection("volunteers").doc(id).get()),
    )
    const volunteers = volunteerDocs
      .filter((d) => d.exists)
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))

    await Promise.all(
      volunteers.map(async (volunteer) => {
        const name = (volunteer as { name?: string }).name ?? "Volunteer"
        const fcmToken = (volunteer as { fcmToken?: string }).fcmToken
        const msg = messageTemplate.replace("{{name}}", name)

        const tasks: Promise<unknown>[] = []

        if (fcmToken) {
          tasks.push(
            messaging
              .send({
                token: fcmToken,
                notification: { title: "SevaSetu Alert", body: msg },
                data: { incidentId },
              })
              .then(() => {
                results.fcm.success++
              })
              .catch((err) => {
                console.error(`[mobilize] FCM failed for ${volunteer.id}:`, err)
                results.fcm.failed++
              }),
          )
        } else {
          results.fcm.failed++
        }

        tasks.push(
          db
            .collection("volunteers")
            .doc(volunteer.id)
            .collection("notifications")
            .add({
              title: "SevaSetu Alert",
              body: msg,
              incidentId,
              createdAt: new Date().toISOString(),
              read: false,
              type: "mobilization",
            })
            .then(() => {
              results.inbox.success++
            })
            .catch((err) => {
              console.error(`[mobilize] inbox failed for ${volunteer.id}:`, err)
              results.inbox.failed++
            }),
        )

        await Promise.allSettled(tasks)
      }),
    )

    await db
      .collection("incidents")
      .doc(incidentId)
      .set(
        {
          mobilizedCount: volunteerIds.length,
          lastMobilizedAt: new Date().toISOString(),
        },
        { merge: true },
      )

    return {
      ok: true,
      mode,
      message: `Mobilized ${volunteerIds.length} volunteers`,
      results,
    }
  } catch (err) {
    console.error("[mobilize] failed:", err)
    return { ok: false, status: 500, error: "Failed to mobilize volunteers." }
  }
}
