import { NextResponse } from "next/server"
import { resolveMode } from "@/backend/config/mode"
import { extractProfileFromAudio } from "@/backend/handlers/onboarding-extract"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const mode = resolveMode(request)

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data with an `audio` field." }, { status: 400 })
  }

  const audio = formData.get("audio")
  if (!audio || !(audio instanceof Blob)) {
    return NextResponse.json({ error: "No audio file provided." }, { status: 400 })
  }

  const result = await extractProfileFromAudio(audio, mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, mode }, { status: result.status })
  }
  return NextResponse.json({ ...result.profile, _mode: result.mode })
}
