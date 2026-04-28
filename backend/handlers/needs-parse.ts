import { getGeminiClient, isGeminiAvailable, parseJsonFromGemini } from "@/backend/config/gemini"
import { demoParsedNeed } from "@/backend/mock/fixtures"
import type { Mode } from "@/backend/config/mode"

export type ParsedNeed = typeof demoParsedNeed

export type ParseNeedResult =
  | { ok: true; mode: Mode; need: ParsedNeed }
  | { ok: false; status: number; error: string }

export async function parseNeedFromDescription(
  description: string,
  mode: Mode,
): Promise<ParseNeedResult> {
  if (!description || typeof description !== "string") {
    return { ok: false, status: 400, error: "A non-empty description is required." }
  }

  if (mode === "demo") {
    return { ok: true, mode, need: { ...demoParsedNeed, summary: description } }
  }

  if (!isGeminiAvailable()) {
    return { ok: false, status: 503, error: "GEMINI_API_KEY is not configured on the server." }
  }

  try {
    const client = getGeminiClient()!
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `
You are an AI assistant for SevaSetu NGOs. Analyze the following natural language description
of a volunteer need and extract the structured data needed to create a job post.

Description:
"${description}"

Return a valid JSON object matching this schema exactly:
{
  "title": "A short, descriptive title",
  "skills": ["array of exact skills"],
  "languages": ["array of languages"],
  "date": "Extracted or inferred date",
  "time": "Extracted time window",
  "duration": "Duration string",
  "location": "Extracted location",
  "urgency": "routine" | "priority" | "critical",
  "slots": number,
  "summary": "original description"
}
Output ONLY the raw JSON.
`.trim()

    const result = await model.generateContent(prompt)
    const need = parseJsonFromGemini<ParsedNeed>(result.response.text())
    return { ok: true, mode, need: { ...need, summary: need.summary || description } }
  } catch (err) {
    console.error("[needs-parse] failed:", err)
    return { ok: false, status: 500, error: "Failed to parse need description." }
  }
}
