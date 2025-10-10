import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const testCase = await request.json()
    if (!testCase.id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }
    if (!testCase.name || !testCase.status || !testCase.service_id) {
      return NextResponse.json({ error: "Nome, status e serviço são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `UPDATE test_cases SET
        name = $1,
        service_id = $2,
        user_story = $3,
        gherkin = $4,
        test_data = $5,
        status = $6,
        is_automated = $7,
        observations = $8
      WHERE id = $9 RETURNING *`,
      [
        testCase.name,
        testCase.service_id ? Number(testCase.service_id) : null,
        testCase.user_story,
        testCase.gherkin,
        testCase.test_data,
        testCase.status,
        testCase.is_automated || false,
        testCase.observations,
        testCase.id
      ]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Caso de teste não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true, test_case: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar caso de teste:", error)
    return NextResponse.json({ error: "Erro ao atualizar caso de teste" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await query(`SELECT * FROM test_cases ORDER BY created_at DESC LIMIT 50`)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar casos de teste' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const testCase = await request.json()
    if (!testCase.name || !testCase.status || !testCase.service_id) {
      return NextResponse.json({ error: "Nome, status e serviço são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `INSERT INTO test_cases (
        name, service_id, user_story, gherkin, test_data, status, is_automated, observations
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        testCase.name,
        testCase.service_id ? Number(testCase.service_id) : null,
        testCase.user_story,
        testCase.gherkin,
        testCase.test_data,
        testCase.status,
        testCase.is_automated || false,
        testCase.observations,
      ]
    )
    return NextResponse.json({ success: true, test_case: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar caso de teste:", error)
    return NextResponse.json({ error: "Erro ao criar caso de teste" }, { status: 500 })
  }
}
