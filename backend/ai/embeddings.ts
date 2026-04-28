import { GoogleGenerativeAI } from "@google/generative-ai"

let cachedClient: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI | null {
  if (cachedClient) return cachedClient
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  cachedClient = new GoogleGenerativeAI(apiKey)
  return cachedClient
}

export function isEmbeddingServiceAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

/**
 * Deterministic 768-dim mock embedding so two equivalent inputs map close together.
 * Used in Demo Mode and as a graceful fallback when GEMINI_API_KEY is missing.
 */
function mockEmbedding(text: string): number[] {
  const dim = 768
  const out = new Array<number>(dim).fill(0)
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  for (const tok of tokens) {
    let h = 2166136261
    for (let i = 0; i < tok.length; i++) {
      h ^= tok.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    const idx = Math.abs(h) % dim
    out[idx] += 1
  }
  // L2 normalize
  let norm = 0
  for (const v of out) norm += v * v
  norm = Math.sqrt(norm) || 1
  return out.map((v) => v / norm)
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getClient()
  if (!client) {
    return mockEmbedding(text)
  }
  try {
    const model = client.getGenerativeModel({ model: "text-embedding-004" })
    const result = await model.embedContent(text)
    return result.embedding.values
  } catch (err) {
    console.error("[backend/ai] embedding failed, falling back to mock:", err)
    return mockEmbedding(text)
  }
}

type VolunteerLike = {
  skills?: string[]
  languages?: string[]
  experience?: string
  location?: { label?: string } | null
  availability?: string[]
}

type NeedLike = {
  title?: string
  description?: string
  skillsRequired?: string[]
  location?: { label?: string } | null
}

export function buildVolunteerSearchText(volunteer: VolunteerLike): string {
  return [
    `Skills: ${(volunteer.skills ?? []).join(", ")}`,
    `Languages: ${(volunteer.languages ?? []).join(", ")}`,
    `Experience: ${volunteer.experience ?? ""}`,
    `Location: ${volunteer.location?.label ?? ""}`,
    `Availability: ${(volunteer.availability ?? []).join(", ")}`,
  ].join("\n")
}

export function buildNeedSearchText(need: NeedLike): string {
  return [
    `Title: ${need.title ?? ""}`,
    `Description: ${need.description ?? ""}`,
    `Required Skills: ${(need.skillsRequired ?? []).join(", ")}`,
    `Location: ${need.location?.label ?? ""}`,
  ].join("\n")
}
