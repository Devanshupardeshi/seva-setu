import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  console.log("API Key present:", !!apiKey)
  
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is missing from environment variables." }, { status: 500 })
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    const { ngoData, pastActivities } = await request.json()
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
      You are a CSR Compliance Officer. Generate a professional CSR Impact Report for an NGO.
      
      NGO Name: ${ngoData.name}
      NGO Focus: ${ngoData.focusAreas.join(", ")}
      Past Activities: ${JSON.stringify(pastActivities)}
      
      The report should include:
      1. Executive Summary
      2. SDG (Sustainable Development Goals) Alignment
      3. Key Impact Metrics (Hours, Beneficiaries)
      4. Qualitative success story (fictional but realistic based on NGO focus)
      5. Compliance note for Section 135 (Companies Act 2013)
      
      IMPORTANT: Return ONLY a valid JSON object. No preamble, no markdown blocks, no post-amble.
      JSON Schema:
      {
        "title": "String title",
        "summary": "Multi-line string",
        "sdgs": ["List"],
        "metrics": [{"label": "Name", "value": "Value"}],
        "story": "String",
        "complianceNote": "String"
      }
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    
    let parsedData
    try {
      // Robust cleaning: Find first { and last }
      const firstBrace = responseText.indexOf("{")
      const lastBrace = responseText.lastIndexOf("}")
      if (firstBrace === -1 || lastBrace === -1) throw new Error("No JSON found")
      
      const jsonString = responseText.substring(firstBrace, lastBrace + 1)
      parsedData = JSON.parse(jsonString)
    } catch (e) {
      console.error("Gemini Output:", responseText)
      return NextResponse.json({ error: "Invalid JSON response from AI." }, { status: 500 })
    }

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error("Error in report generation route:", error)
    return NextResponse.json({ 
      error: error.message || "Internal server error",
      details: error.stack
    }, { status: 500 })
  }
}
