import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const improvement = await request.json()
    if (!improvement.id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }
    if (!improvement.name || !improvement.status || !improvement.service_id) {
      return NextResponse.json({ error: "Nome, status e serviço são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `UPDATE improvements SET
        name = $1,
        description = $2,
        service_id = $3,
        user_story = $4,
        evidence = $5,
        status = $6,
        observations = $7
      WHERE id = $8 RETURNING *`,
      [
        improvement.name,
        improvement.description,
        improvement.service_id ? Number(improvement.service_id) : null,
        improvement.user_story,
        improvement.evidence,
        improvement.status,
        improvement.observations,
        improvement.id
      ]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Melhoria não encontrada" }, { status: 404 })
    }
    return NextResponse.json({ success: true, improvement: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar melhoria:", error)
    return NextResponse.json({ error: "Erro ao atualizar melhoria" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await query(`SELECT * FROM improvements ORDER BY created_at DESC LIMIT 50`)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar melhorias' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const improvement = await request.json()
    if (!improvement.name || !improvement.status || !improvement.service_id) {
      return NextResponse.json({ error: "Nome, status e serviço são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `INSERT INTO improvements (
        name, description, service_id, user_story, evidence, status, observations
      ) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        improvement.name,
        improvement.description,
        improvement.service_id ? Number(improvement.service_id) : null,
        improvement.user_story,
        improvement.evidence,
        improvement.status,
        improvement.observations,
      ]
    )
    return NextResponse.json({ success: true, improvement: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar melhoria:", error)
    return NextResponse.json({ error: "Erro ao criar melhoria" }, { status: 500 })
  }
}
