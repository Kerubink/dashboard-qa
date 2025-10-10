import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const plan = await request.json()
    if (!plan.id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }
    if (!plan.name || !plan.status || !plan.service_id) {
      return NextResponse.json({ error: "Nome, status e serviço são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `UPDATE performance_plans SET
        name = $1,
        description = $2,
        service_id = $3,
        test_type = $4,
        target_metrics = $5,
        test_data = $6,
        execution_date = $7,
        results = $8,
        status = $9,
        observations = $10
      WHERE id = $11 RETURNING *`,
      [
        plan.name,
        plan.description,
        plan.service_id ? Number(plan.service_id) : null,
        plan.test_type,
        plan.target_metrics,
        plan.test_data,
        plan.execution_date,
        plan.results,
        plan.status,
        plan.observations,
        plan.id
      ]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true, performance_plan: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar plano de performance:", error)
    return NextResponse.json({ error: "Erro ao atualizar plano de performance" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await query(`SELECT * FROM performance_plans ORDER BY created_at DESC LIMIT 50`)
    return NextResponse.json(result.rows)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar planos de performance' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const plan = await request.json()
    if (!plan.name || !plan.status || !plan.service_id) {
      return NextResponse.json({ error: "Nome, status e serviço são obrigatórios" }, { status: 400 })
    }
    const result = await query(
      `INSERT INTO performance_plans (
        name, description, service_id, test_type, target_metrics, test_data, execution_date, results, status, observations
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        plan.name,
        plan.description,
        plan.service_id ? Number(plan.service_id) : null,
        plan.test_type,
        plan.target_metrics,
        plan.test_data,
        plan.execution_date,
        plan.results,
        plan.status,
        plan.observations,
      ]
    )
    return NextResponse.json({ success: true, performance_plan: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar plano de performance:", error)
    return NextResponse.json({ error: "Erro ao criar plano de performance" }, { status: 500 })
  }
}
