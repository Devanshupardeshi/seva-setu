import { NextResponse } from "next/server"
import { resolveMode } from "@/backend/config/mode"
import { generateBriefing } from "@/backend/handlers/briefing"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(
  request: Request,
  // Next.js 15+ async dynamic params
  context: { params: Promise<{ id: string }> },
) {
  // Touch params to satisfy framework expectations even though briefing is
  // currently driven by the request body.
  await context.params

  const mode = resolveMode(request)

  let body: Parameters<typeof generateBriefing>[0]
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const result = await generateBriefing(body ?? {}, mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, mode }, { status: result.status })
  }
  return NextResponse.json({ ...result.briefing, _mode: result.mode })
}
