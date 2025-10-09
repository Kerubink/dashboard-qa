import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { plans } = await request.json()

    if (!Array.isArray(plans) || plans.length === 0) {
      return NextResponse.json({ error: "Nenhum plano fornecido" }, { status: 400 })
    }

    const insertPromises = plans.map((plan) =>
      query(
        `INSERT INTO performance_plans (
          name, description, service, type, status, virtual_users,
          duration_minutes, expected_tps, actual_tps, response_time_ms,
          error_rate, execution_date, tool, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          plan.name,
          plan.description,
          plan.service,
          plan.type,
          plan.status,
          plan.virtual_users,
          plan.duration_minutes,
          plan.expected_tps,
          plan.actual_tps,
          plan.response_time_ms,
          plan.error_rate,
          plan.execution_date || new Date(),
          plan.tool,
          plan.observations,
        ],
      ),
    )

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      count: plans.length,
      message: `${plans.length} planos importados com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao importar planos:", error)
    return NextResponse.json({ error: "Erro ao importar planos de performance" }, { status: 500 })
  }
}
