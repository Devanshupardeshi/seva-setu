import { NextResponse } from "next/server"
import { resolveMode } from "@/backend/config/mode"
import { parseNeedFromDescription } from "@/backend/handlers/needs-parse"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const mode = resolveMode(request)

  let body: { description?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const result = await parseNeedFromDescription(body?.description ?? "", mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, mode }, { status: result.status })
  }
  return NextResponse.json({ ...result.need, _mode: result.mode })
}
