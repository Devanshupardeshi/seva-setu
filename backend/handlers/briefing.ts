import { getGeminiClient, isGeminiAvailable, parseJsonFromGemini } from "@/backend/config/gemini"
import { demoBriefing } from "@/backend/mock/fixtures"
import type { Mode } from "@/backend/config/mode"

export type Briefing = typeof demoBriefing

export type BriefingResult =
  | { ok: true; mode: Mode; briefing: Briefing }
  | { ok: false; status: number; error: string }

export async function generateBriefing(
  payload: { needContext?: unknown; volunteerContext?: unknown; ngoContext?: unknown },
  mode: Mode,
): Promise<BriefingResult> {
  if (mode === "demo") {
    return { ok: true, mode, briefing: demoBriefing }
  }

  if (!isGeminiAvailable()) {
    return { ok: false, status: 503, error: "GEMINI_API_KEY is not configured on the server." }
  }

  try {
    const client = getGeminiClient()!
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `
You are an NGO briefing assistant. Create a personalised briefing for a volunteer
assigned to a specific need.

Need details: ${JSON.stringify(payload.needContext ?? {})}
Volunteer details: ${JSON.stringify(payload.volunteerContext ?? {})}
NGO details: ${JSON.stringify(payload.ngoContext ?? {})}

Return a valid JSON object matching this schema:
{
  "prep": [string],
  "lessonPlan": [string],
  "whatToBring": [string],
  "culturalNotes": [string],
  "safety": [string]
}
Return ONLY the raw JSON.
`.trim()

    const result = await model.generateContent(prompt)
    const briefing = parseJsonFromGemini<Briefing>(result.response.text())
    return { ok: true, mode, briefing }
  } catch (err) {
    console.error("[briefing] failed:", err)
    return { ok: false, status: 500, error: "Failed to generate briefing." }
  }
}
