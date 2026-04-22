import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

export async function POST(request: Request) {
  if (!genAI) {
    return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 })
  }

  try {
    const { description } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Valid description is required." }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
      You are an AI assistant for SevaSetu NGOs. Analyze the following natural language description
      of a volunteer need and extract the structured data needed to create a job post.
      
      Description:
      "${description}"
      
      Return a valid JSON object matching this schema exactly:
      {
        "title": "A short, descriptive title (e.g., 'Math Tutor Needed')",
        "skills": ["array of exact skills like 'Math', 'Teaching'"],
        "languages": ["array of languages like 'Hindi', 'Marathi'"],
        "date": "Extracted or inferred date (e.g. 'This Saturday')",
        "time": "Extracted time window (e.g. '3:00 - 5:00 PM')",
        "duration": "Duration describing string (e.g. '2 hours')",
        "location": "Extracted location (e.g. 'Bandra, Mumbai')",
        "urgency": "routine", "priority", or "critical" (infer from context),
        "slots": number (how many volunteers needed, default to 1 if unclear),
        "summary": "original description provided"
      }
      
      Output ONLY the raw JSON string without markdown formatting.
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    
    let parsedData
    try {
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
      parsedData = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Failed to parse Gemini parsing output:", responseText)
      return NextResponse.json({ error: "Invalid JSON response from AI." }, { status: 500 })
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error in need parsing route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
