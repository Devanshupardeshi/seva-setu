import aiplatform from "@google-cloud/aiplatform"

const { MatchServiceClient } = aiplatform.v1

const projectId = process.env.GCP_PROJECT
const location = "us-central1"
const indexEndpointId = process.env.VECTOR_INDEX_ENDPOINT
const deployedIndexId = process.env.VECTOR_INDEX_DEPLOYED_ID

const clientOptions = {
  apiEndpoint: process.env.VECTOR_INDEX_ENDPOINT_DOMAIN || `${location}-aiplatform.googleapis.com`,
}

// In a real environment with initialized credentials, this will construct the client.
// We make it lazy to avoid failing if GCP credentials aren't set during build.
let matchServiceClient: any = null

export async function findNearestVolunteers(queryVector: number[], k: number = 20) {
  if (!projectId || !indexEndpointId || !deployedIndexId) {
    console.warn("Missing Vector Search config. Returning mock scores.")
    // Fallback if GCP isn't configured
    return [
      { id: "v_priya", distance: 0.85 },
      { id: "v_rahul", distance: 0.72 },
    ]
  }

  if (!matchServiceClient) {
    matchServiceClient = new MatchServiceClient(clientOptions)
  }

  const endpoint = matchServiceClient.indexEndpointPath(projectId, location, indexEndpointId)

  const request = {
    indexEndpoint: endpoint,
    deployedIndexId,
    queries: [
      {
        datapoint: {
          datapointId: "query",
          featureVector: queryVector,
        },
        neighborCount: k,
      },
    ],
  }

  const [response] = await matchServiceClient.findNeighbors(request)
  const neighbors = response.nearestNeighbors?.[0]?.neighbors || []

  return neighbors.map((n: any) => ({
    id: n.datapoint.datapointId,
    distance: n.distance,
  }))
}
