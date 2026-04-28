import { NextResponse } from "next/server"
import { resolveMode } from "@/backend/config/mode"
import { mobilizeVolunteers } from "@/backend/handlers/mobilize"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const mode = resolveMode(request)

  let body: Parameters<typeof mobilizeVolunteers>[0]
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const result = await mobilizeVolunteers(body ?? {}, mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, mode }, { status: result.status })
  }
  return NextResponse.json({
    success: true,
    mode: result.mode,
    message: result.message,
    results: result.results,
  })
}
