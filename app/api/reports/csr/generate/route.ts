import { NextResponse } from "next/server"
import { resolveMode } from "@/backend/config/mode"
import { generateCsrReport } from "@/backend/handlers/csr-report"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const mode = resolveMode(request)

  let body: Parameters<typeof generateCsrReport>[0]
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const result = await generateCsrReport(body ?? {}, mode)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, mode }, { status: result.status })
  }
  return NextResponse.json({ ...result.report, _mode: result.mode })
}
