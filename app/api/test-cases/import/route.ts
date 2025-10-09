import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { testCases } = await request.json()

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json({ error: "Nenhum caso de teste fornecido" }, { status: 400 })
    }

    const insertPromises = testCases.map((tc) =>
      query(
        `INSERT INTO test_cases (
          name, description, service, user_story, gherkin, test_data,
          status, is_automated, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          tc.name,
          tc.description,
          tc.service,
          tc.user_story,
          tc.gherkin,
          tc.test_data,
          tc.status,
          tc.is_automated,
          tc.observations,
        ],
      ),
    )

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      count: testCases.length,
      message: `${testCases.length} casos de teste importados com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao importar casos de teste:", error)
    return NextResponse.json({ error: "Erro ao importar casos de teste" }, { status: 500 })
  }
}
