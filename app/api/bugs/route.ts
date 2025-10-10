import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const bug = await request.json()
    if (!bug.id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }
    if (!bug.name || !bug.status || !bug.service_id || !bug.test_id) {
      return NextResponse.json({ error: "Nome, status, serviço e teste são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `UPDATE bugs SET
        name = $1,
        description = $2,
        user_story = $3,
        gherkin = $4,
        evidence = $5,
        status = $6,
        criticality = $7,
        risk = $8,
        observations = $9,
        service_id = $10,
        test_id = $11,
        responsible_qa = $12,
        responsible_dev = $13
      WHERE id = $14 RETURNING *`,
      [
        bug.name,
        bug.description,
        bug.user_story,
        bug.gherkin,
        bug.evidence,
        bug.status,
        bug.criticality,
        bug.risk,
        bug.observations,
        bug.service_id ? Number(bug.service_id) : null,
        bug.test_id ? Number(bug.test_id) : null,
        bug.responsible_qa,
        bug.responsible_dev,
        bug.id
      ]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Bug não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true, bug: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar bug:", error)
    return NextResponse.json({ error: "Erro ao atualizar bug" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await query(`
      SELECT * FROM bugs
      ORDER BY 
        CASE status
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'resolved' THEN 3
          WHEN 'closed' THEN 4
        END,
        created_at DESC
      LIMIT 50
    `)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar bugs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const bug = await request.json()
    if (!bug.name || !bug.status || !bug.service_id || !bug.test_id) {
      return NextResponse.json({ error: "Nome, status, serviço e teste são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `INSERT INTO bugs (
        name, description, user_story, gherkin, evidence, status, criticality, risk, observations, service_id, test_id, responsible_qa, responsible_dev
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        bug.name,
        bug.description,
        bug.user_story,
        bug.gherkin,
        bug.evidence,
        bug.status,
        bug.criticality,
        bug.risk,
        bug.observations,
        bug.service_id ? Number(bug.service_id) : null,
        bug.test_id ? Number(bug.test_id) : null,
        bug.responsible_qa,
        bug.responsible_dev,
      ]
    )
    return NextResponse.json({ success: true, bug: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar bug:", error)
    return NextResponse.json({ error: "Erro ao criar bug" }, { status: 500 })
  }
}
