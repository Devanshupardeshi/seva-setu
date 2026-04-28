import { getGeminiClient, isGeminiAvailable, parseJsonFromGemini } from "@/backend/config/gemini"
import { demoVolunteerProfile } from "@/backend/mock/fixtures"
import type { Mode } from "@/backend/config/mode"

export type ExtractedProfile = typeof demoVolunteerProfile

export type ExtractResult =
  | { ok: true; mode: Mode; profile: ExtractedProfile }
  | { ok: false; status: number; error: string }

const PROMPT = `
You are an AI assistant for SevaSetu, a volunteer matching platform.
Listen to the following audio recording of a user describing themselves and their desire to volunteer.
Extract their profile information into a valid JSON object with the following schema:
{
  "name": "string",
  "skills": ["array of skills e.g. 'Teaching', 'Python'"],
  "languages": ["array of languages e.g. 'Hindi', 'English'"],
  "availability": ["array of days e.g. 'sat', 'sun', 'mon'"],
  "experience": "student" | "early-career" | "professional" | "retired",
  "remoteOk": boolean
}
Return ONLY raw JSON. No markdown fences.
`.trim()

export async function extractProfileFromAudio(
  audio: Blob,
  mode: Mode,
): Promise<ExtractResult> {
  if (mode === "demo") {
    return { ok: true, mode, profile: demoVolunteerProfile }
  }

  if (!isGeminiAvailable()) {
    return { ok: false, status: 503, error: "GEMINI_API_KEY is not configured on the server." }
  }

  try {
    const client = getGeminiClient()!
    const arrayBuffer = await audio.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString("base64")

    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          mimeType: audio.type || "audio/webm",
          data: base64Data,
        },
      },
    ])

    const text = result.response.text()
    const profile = parseJsonFromGemini<ExtractedProfile>(text)
    return { ok: true, mode, profile }
  } catch (err) {
    console.error("[onboarding-extract] failed:", err)
    return { ok: false, status: 500, error: "Failed to extract profile from audio." }
  }
}
