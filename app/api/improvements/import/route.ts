import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { improvements } = await request.json()

    if (!Array.isArray(improvements) || improvements.length === 0) {
      return NextResponse.json({ error: "Nenhuma melhoria fornecida" }, { status: 400 })
    }

    const insertPromises = improvements.map((improvement) =>
      query(
        `INSERT INTO improvements (
          name, description, status, priority, impact, test_link,
          user_story, gherkin, evidence, proposed_date, implemented_date, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          improvement.name,
          improvement.description,
          improvement.status,
          improvement.priority,
          improvement.impact,
          improvement.test_link,
          improvement.user_story,
          improvement.gherkin,
          improvement.evidence,
          improvement.proposed_date || new Date(),
          improvement.implemented_date,
          improvement.observations,
        ],
      ),
    )

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      count: improvements.length,
      message: `${improvements.length} melhorias importadas com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao importar melhorias:", error)
    return NextResponse.json({ error: "Erro ao importar melhorias" }, { status: 500 })
  }
}
