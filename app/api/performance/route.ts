import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const performancePlanSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  test_type: z.string().optional(),
  target_metrics: z.string().optional(),
  test_data: z.string().optional(),
  results: z.string().optional(),
  status: z.string().min(1, "O status é obrigatório"),
  observations: z.string().optional(),
  service_id: z.number().min(1, "O serviço é obrigatório"),
})

export async function GET() {
  try {
    const result = await query("SELECT * FROM performance_plans ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar planos de performance:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = performancePlanSchema.parse(body)

    const result = await query(
      `INSERT INTO performance_plans (name, description, test_type, target_metrics, test_data, results, status, observations, service_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [data.name, data.description, data.test_type, data.target_metrics, data.test_data, data.results, data.status, data.observations, data.service_id]
    )

    revalidatePath("/performance")
    return NextResponse.json({ success: true, plan: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar plano de performance:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar plano de performance" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = performancePlanSchema.extend({ id: z.number() }).parse(body)

    const result = await query(
      `UPDATE performance_plans SET name = $1, description = $2, test_type = $3, target_metrics = $4, test_data = $5, results = $6, status = $7, observations = $8, service_id = $9 WHERE id = $10 RETURNING *`,
      [data.name, data.description, data.test_type, data.target_metrics, data.test_data, data.results, data.status, data.observations, data.service_id, id]
    )

    revalidatePath("/performance")
    return NextResponse.json({ success: true, plan: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar plano de performance:", error)
    return NextResponse.json({ error: "Erro ao atualizar plano de performance" }, { status: 500 })
  }
}

const deletePlanSchema = z.object({
  id: z.number(),
})

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = deletePlanSchema.parse(body)

    await query("DELETE FROM performance_plans WHERE id = $1", [id])

    revalidatePath("/performance")
    return NextResponse.json({ message: "Plano de performance deletado com sucesso." }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar plano de performance:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}