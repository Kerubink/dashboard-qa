import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { bugs } = await request.json()

    if (!Array.isArray(bugs) || bugs.length === 0) {
      return NextResponse.json({ error: "Nenhum bug fornecido" }, { status: 400 })
    }

    const insertPromises = bugs.map((bug) =>
      query(
        `INSERT INTO bugs (
          name, description, status, priority, severity, test_link,
          user_story, gherkin, evidence, found_date, resolved_date, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          bug.name,
          bug.description,
          bug.status,
          bug.priority,
          bug.severity,
          bug.test_link,
          bug.user_story,
          bug.gherkin,
          bug.evidence,
          bug.found_date || new Date(),
          bug.resolved_date,
          bug.observations,
        ],
      ),
    )

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      count: bugs.length,
      message: `${bugs.length} bugs importados com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao importar bugs:", error)
    return NextResponse.json({ error: "Erro ao importar bugs" }, { status: 500 })
  }
}
