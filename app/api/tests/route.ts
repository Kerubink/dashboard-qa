export async function PUT(request: Request) {
  try {
    const test = await request.json()
    if (!test.id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }
    if (!test.name || !test.type || !test.service_id || !test.test_case_id) {
      return NextResponse.json({ error: "Nome, tipo, serviço e caso de teste são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `UPDATE tests SET
        name = $1,
        description = $2,
        test_case_id = $3,
        service_id = $4,
        type = $5,
        result = $6,
        execution_date = $7,
        execution_type = $8,
        execution_location = $9,
        execution_method = $10,
        test_data = $11,
        jira_link = $12,
        bug_link = $13,
        evidence = $14,
        responsible_qa = $15,
        responsible_dev = $16
      WHERE id = $17 RETURNING *`,
      [
        test.name,
        test.description,
        test.test_case_id ? Number(test.test_case_id) : null,
        test.service_id ? Number(test.service_id) : null,
        test.type,
        test.result,
        test.execution_date,
        test.execution_type,
        test.execution_location,
        test.execution_method,
        test.test_data,
        test.jira_link,
        test.bug_link,
        test.evidence,
        test.responsible_qa,
        test.responsible_dev,
        test.id
      ]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true, test: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar teste:", error)
    return NextResponse.json({ error: "Erro ao atualizar teste" }, { status: 500 })
  }
}
export async function GET() {
  try {
    const result = await query(`SELECT * FROM tests ORDER BY created_at DESC LIMIT 50`)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar testes' }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const test = await request.json()
    if (!test.name || !test.type) {
      return NextResponse.json({ error: "Nome e tipo são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `INSERT INTO tests (
        name, description, test_case_id, service_id, type, result, execution_date, execution_type, execution_location, execution_method, test_data, jira_link, bug_link, evidence, responsible_qa, responsible_dev
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [
        test.name,
        test.description,
        test.test_case_id ? Number(test.test_case_id) : null,
        test.service_id ? Number(test.service_id) : null,
        test.type,
        test.result,
        test.execution_date,
        test.execution_type,
        test.execution_location,
        test.execution_method,
        test.test_data,
        test.jira_link,
        test.bug_link,
        test.evidence,
        test.responsible_qa,
        test.responsible_dev,
      ]
    )
    return NextResponse.json({ success: true, test: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar teste:", error)
    return NextResponse.json({ error: "Erro ao criar teste" }, { status: 500 })
  }
}
