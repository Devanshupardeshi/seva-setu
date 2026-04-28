import { GoogleGenerativeAI } from "@google/generative-ai"

let cachedClient: GoogleGenerativeAI | null = null

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (cachedClient) return cachedClient
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  cachedClient = new GoogleGenerativeAI(apiKey)
  return cachedClient
}

export function isGeminiAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

/**
 * Robustly extract a JSON object from a Gemini text response. Handles common cases:
 *   - Plain JSON
 *   - JSON wrapped in ```json fences
 *   - Surrounding prose; we extract from the first `{` to the last `}`.
 */
export function parseJsonFromGemini<T = unknown>(text: string): T {
  const trimmed = text.trim()

  // Try fence stripping first
  const fenced = trimmed.replace(/```json/gi, "").replace(/```/g, "").trim()
  try {
    return JSON.parse(fenced) as T
  } catch {
    // fall through
  }

  const first = fenced.indexOf("{")
  const last = fenced.lastIndexOf("}")
  if (first !== -1 && last !== -1 && last > first) {
    return JSON.parse(fenced.slice(first, last + 1)) as T
  }
  throw new Error("Failed to parse JSON from Gemini response")
}
