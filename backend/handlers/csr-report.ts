import { getGeminiClient, isGeminiAvailable, parseJsonFromGemini } from "@/backend/config/gemini"
import { demoCsrReport } from "@/backend/mock/fixtures"
import type { Mode } from "@/backend/config/mode"

export type CsrReport = typeof demoCsrReport

export type CsrReportResult =
  | { ok: true; mode: Mode; report: CsrReport }
  | { ok: false; status: number; error: string }

type NgoData = { name?: string; focusAreas?: string[] }
type ActivityData = unknown

export async function generateCsrReport(
  payload: { ngoData?: NgoData; pastActivities?: ActivityData },
  mode: Mode,
): Promise<CsrReportResult> {
  if (mode === "demo") {
    const name = payload.ngoData?.name
    return {
      ok: true,
      mode,
      report: name ? { ...demoCsrReport, title: `Annual CSR Impact Report — ${name}` } : demoCsrReport,
    }
  }

  if (!isGeminiAvailable()) {
    return { ok: false, status: 503, error: "GEMINI_API_KEY is not configured on the server." }
  }

  const ngoData = payload.ngoData ?? {}
  const focusAreas = ngoData.focusAreas ?? []

  try {
    const client = getGeminiClient()!
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `
You are a CSR Compliance Officer. Generate a professional CSR Impact Report for an NGO.

NGO Name: ${ngoData.name ?? ""}
NGO Focus: ${focusAreas.join(", ")}
Past Activities: ${JSON.stringify(payload.pastActivities ?? [])}

The report should include:
1. Executive Summary
2. SDG (Sustainable Development Goals) Alignment
3. Key Impact Metrics (Hours, Beneficiaries)
4. Qualitative success story
5. Compliance note for Section 135 (Companies Act 2013)

Return ONLY a valid JSON object with the schema:
{
  "title": string,
  "summary": string,
  "sdgs": [string],
  "metrics": [{ "label": string, "value": string }],
  "story": string,
  "complianceNote": string
}
`.trim()

    const result = await model.generateContent(prompt)
    const report = parseJsonFromGemini<CsrReport>(result.response.text())
    return { ok: true, mode, report }
  } catch (err) {
    console.error("[csr-report] failed:", err)
    return { ok: false, status: 500, error: "Failed to generate CSR report." }
  }
}
