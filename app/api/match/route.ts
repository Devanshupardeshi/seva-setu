import { NextResponse } from "next/server"
import { resolveMode } from "@/backend/config/mode"
import { matchVolunteersForNeed } from "@/backend/handlers/match"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const mode = resolveMode(request)

  let body: { need?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const result = await matchVolunteersForNeed(body?.need, mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, mode }, { status: result.status })
  }
  return NextResponse.json({
    matches: result.matches,
    mode: result.mode,
    usedFallback: result.usedFallback,
  })
}
