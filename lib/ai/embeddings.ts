import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!genAI) {
    console.warn("GEMINI_API_KEY not set, using mock embeddings")
    return new Array(768).fill(0).map(() => Math.random())
  }
  
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" })
  const result = await model.embedContent(text)
  const embedding = result.embedding.values
  return embedding
}

export function buildVolunteerSearchText(volunteer: any): string {
  return `
    Skills: ${volunteer.skills.join(", ")}
    Languages: ${volunteer.languages.join(", ")}
    Experience: ${volunteer.experience}
    Location: ${volunteer.location.label}
    Availability: ${volunteer.availability.join(", ")}
  `.trim()
}

export function buildNeedSearchText(need: any): string {
  return `
    Title: ${need.title}
    Description: ${need.description}
    Required Skills: ${need.skillsRequired.join(", ")}
    Location: ${need.location.label}
  `.trim()
}
