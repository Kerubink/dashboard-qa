import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { tests } = await request.json()

    if (!Array.isArray(tests) || tests.length === 0) {
      return NextResponse.json({ error: "Nenhum teste fornecido" }, { status: 400 })
    }

    // Insere todos os testes
    const insertPromises = tests.map((test) =>
      query(
        `INSERT INTO tests (
          name, description, type, result, execution_type, responsible,
          service, test_date, jira_link, bug_link, test_data, environment,
          evidence, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          test.name,
          test.description,
          test.type,
          test.result,
          test.execution_type,
          test.responsible,
          test.service,
          test.test_date || new Date(),
          test.jira_link,
          test.bug_link,
          test.test_data,
          test.environment,
          test.evidence,
          test.observations,
        ],
      ),
    )

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      count: tests.length,
      message: `${tests.length} testes importados com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao importar testes:", error)
    return NextResponse.json({ error: "Erro ao importar testes" }, { status: 500 })
  }
}
