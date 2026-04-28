import aiplatform from "@google-cloud/aiplatform"

const projectId = process.env.GCP_PROJECT
const location = process.env.GCP_LOCATION ?? "us-central1"
const indexEndpointId = process.env.VECTOR_INDEX_ENDPOINT
const deployedIndexId = process.env.VECTOR_INDEX_DEPLOYED_ID

let matchServiceClient: InstanceType<typeof aiplatform.v1.MatchServiceClient> | null = null

function getClient() {
  if (matchServiceClient) return matchServiceClient
  const { MatchServiceClient } = aiplatform.v1
  matchServiceClient = new MatchServiceClient({
    apiEndpoint:
      process.env.VECTOR_INDEX_ENDPOINT_DOMAIN || `${location}-aiplatform.googleapis.com`,
  })
  return matchServiceClient
}

export function isVectorSearchAvailable(): boolean {
  return Boolean(projectId && indexEndpointId && deployedIndexId)
}

export type Neighbor = { id: string; distance: number }

/**
 * Cosine-like similarity over locally cached vectors. Used in Demo Mode and as a
 * fallback when Vertex Vector Search isn't configured.
 */
export function localKNN(
  queryVector: number[],
  candidates: Array<{ id: string; vector: number[] }>,
  k = 20,
): Neighbor[] {
  const dot = (a: number[], b: number[]) => {
    let s = 0
    const len = Math.min(a.length, b.length)
    for (let i = 0; i < len; i++) s += a[i] * b[i]
    return s
  }
  const norm = (a: number[]) => Math.sqrt(a.reduce((acc, v) => acc + v * v, 0)) || 1
  const qn = norm(queryVector)
  const scored = candidates.map((c) => {
    const sim = dot(queryVector, c.vector) / (qn * norm(c.vector))
    return { id: c.id, distance: sim }
  })
  return scored.sort((a, b) => b.distance - a.distance).slice(0, k)
}

export async function findNearestVolunteers(
  queryVector: number[],
  k = 20,
): Promise<Neighbor[]> {
  if (!isVectorSearchAvailable()) {
    console.warn("[backend/ai] Vector Search not configured; returning empty neighbour set")
    return []
  }

  try {
    const client = getClient()
    const endpoint = client.indexEndpointPath(projectId!, location, indexEndpointId!)

    const [response] = await client.findNeighbors({
      indexEndpoint: endpoint,
      deployedIndexId: deployedIndexId!,
      queries: [
        {
          datapoint: { datapointId: "query", featureVector: queryVector },
          neighborCount: k,
        },
      ],
    })

    const neighbors = response.nearestNeighbors?.[0]?.neighbors ?? []
    return neighbors
      .filter((n) => n.datapoint?.datapointId)
      .map((n) => ({
        id: n.datapoint!.datapointId as string,
        distance: typeof n.distance === "number" ? n.distance : 0,
      }))
  } catch (err) {
    console.error("[backend/ai] Vector Search failed:", err)
    return []
  }
}
