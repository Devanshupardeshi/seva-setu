import { NextResponse } from "next/server"
import { generateEmbedding, buildNeedSearchText } from "@/lib/ai/embeddings"
import { findNearestVolunteers } from "@/lib/ai/vector-search"

export async function POST(request: Request) {
  try {
    const { need } = await request.json()

    if (!need) {
      return NextResponse.json({ error: "Need data is required." }, { status: 400 })
    }

    // 1. Build text representation of the need
    const searchText = buildNeedSearchText(need)

    // 2. Generate embedding
    const queryVector = await generateEmbedding(searchText)

    // 3. Search Vertex AI Vector Search
    const neighbors = await findNearestVolunteers(queryVector, 20)

    // In a full implementation, you would:
    // a. Fetch these volunteers from Firestore
    // b. Re-rank them combining semantic distance (0.6), trust score (0.2), and geographic proximity (0.2)
    //    e.g.: finalScore = (distance * 0.6) + ((trustScore / 5) * 0.2) + (calculateDistance(need.loc, vol.loc) * 0.2)
    
    return NextResponse.json({ matches: neighbors })
  } catch (error) {
    console.error("Error in match route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
