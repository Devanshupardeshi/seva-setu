import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function POST(request: Request, context: { params: { id: string } }) {
  if (!genAI) {
    return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 })
  }

  try {
    // In a real implementation, we would fetch the Need and Volunteer data 
    // from Firestore using context.params.id (match ID). 
    // For now we expect the client to send the context.
    const { needContext, volunteerContext, ngoContext } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
      You are an NGO briefing assistant. Create a personalized briefing for a volunteer
      assigned to a specific need. 

      Need details: ${JSON.stringify(needContext)}
      Volunteer details: ${JSON.stringify(volunteerContext)}
      NGO details: ${JSON.stringify(ngoContext)}

      Generate a valid JSON object matching this schema exactly:
      {
        "prep": ["array of preparatory steps (e.g. read materials, review concepts)"],
        "lessonPlan": ["optional array if teaching/mentoring is involved"],
        "whatToBring": ["array of physical items to bring (e.g. ID, water bottle, laptop)"],
        "culturalNotes": ["array of notes on etiquette, handling beneficiaries, sensitivity"],
        "safety": ["array of safety guidelines"]
      }

      Return ONLY the JSON string. Do not use Markdown code blocks.
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    
    let parsedData
    try {
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
      parsedData = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Failed to parse Gemini briefing output:", responseText)
      return NextResponse.json({ error: "Invalid JSON response from AI." }, { status: 500 })
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error in briefing generation route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
