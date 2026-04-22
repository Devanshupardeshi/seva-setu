import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// We need an API key to initialize the SDK
const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey!)

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as Blob | null

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 })
    }

    // Convert the Blob to a base64 string
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString("base64")

    // Use Gemini 2.5 flash which has multimodal capabilities
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Prompt instructions to extract volunteer profile
    const prompt = `
      You are an AI assistant for SevaSetu, a volunteer matching platform.
      Listen to the following audio recording of a user describing themselves and their desire to volunteer.
      Extract their profile information into a valid JSON object with the following schema:
      {
        "name": "string (extract or guess based on audio)",
        "skills": ["array of skills they mention e.g., 'Teaching', 'Python'"],
        "languages": ["array of languages they peak e.g., 'Hindi', 'English'"],
        "availability": ["array of days e.g., 'sat', 'sun', 'mon'"],
        "experience": "student", "early-career", "professional", or "retired",
        "remoteOk": boolean (if they want remote work, true, else false)
      }
      Return ONLY the raw JSON object, without any markdown formatting like \`\`\`json.
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: audioFile.type || "audio/webm",
          data: base64Data,
        },
      },
    ])

    const responseText = result.response.text().trim()
    
    // Attempt to parse the response text as JSON
    // Sometimes Gemini wraps it in ```json ... ``` even when told not to.
    let parsedData
    try {
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
      parsedData = JSON.parse(cleanedText)
    } catch (e) {
      console.error("Failed to parse Gemini output:", responseText)
      return NextResponse.json({ error: "Failed to parse structured output from Gemini." }, { status: 500 })
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Error in extraction route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
