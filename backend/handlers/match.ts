import { generateEmbedding, buildNeedSearchText } from "@/backend/ai/embeddings"
import { findNearestVolunteers, isVectorSearchAvailable } from "@/backend/ai/vector-search"
import { demoMatches } from "@/backend/mock/fixtures"
import type { Mode } from "@/backend/config/mode"

export type Match = { id: string; distance: number }

export type MatchResult =
  | { ok: true; mode: Mode; matches: Match[]; usedFallback: boolean }
  | { ok: false; status: number; error: string }

export async function matchVolunteersForNeed(
  need: unknown,
  mode: Mode,
): Promise<MatchResult> {
  if (!need || typeof need !== "object") {
    return { ok: false, status: 400, error: "A `need` object is required." }
  }

  if (mode === "demo") {
    return { ok: true, mode, matches: demoMatches, usedFallback: true }
  }

  try {
    const searchText = buildNeedSearchText(need as Parameters<typeof buildNeedSearchText>[0])
    const queryVector = await generateEmbedding(searchText)

    if (!isVectorSearchAvailable()) {
      // Vector Search not configured: fall back to demo matches but report it.
      return { ok: true, mode, matches: demoMatches, usedFallback: true }
    }

    const matches = await findNearestVolunteers(queryVector, 20)
    if (matches.length === 0) {
      return { ok: true, mode, matches: demoMatches, usedFallback: true }
    }
    return { ok: true, mode, matches, usedFallback: false }
  } catch (err) {
    console.error("[match] failed:", err)
    return { ok: false, status: 500, error: "Failed to match volunteers." }
  }
}
