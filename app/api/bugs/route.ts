import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const bugSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  status: z.string().min(1, "O status é obrigatório"),
  criticality: z.string().min(1, "A criticidade é obrigatória"),
  risk: z.string().min(1, "O risco é obrigatório"),
  test_id: z.number().min(1, "O teste relacionado é obrigatório"),
  service_id: z.number().min(1, "O serviço é obrigatório"),
  // Campos que parecem estar no formulário mas não na tabela, tornando opcionais para evitar erros
  user_story: z.string().optional(),
  gherkin: z.string().optional(),
  evidence: z.string().optional(),
  observations: z.string().optional(),
  responsible_qa: z.string().optional(),
  responsible_dev: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const queryText = searchParams.get("query")
  const status = searchParams.get("status")
  const criticality = searchParams.get("criticality")
  const risk = searchParams.get("risk")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const responsible = searchParams.get("responsible")

  const whereClauses: string[] = []
  const params: (string | number)[] = []
  let paramIndex = 1

  if (queryText) {
    whereClauses.push(
      `(b.name ILIKE $${paramIndex} OR b.description ILIKE $${paramIndex})`
    )
    params.push(`%${queryText}%`)
    paramIndex++
  }

  if (status && status !== "all") {
    whereClauses.push(`b.status = $${paramIndex}`)
    params.push(status)
    paramIndex++
  }

  if (criticality && criticality !== "all") {
    whereClauses.push(`b.criticality = $${paramIndex}`)
    params.push(criticality)
    paramIndex++
  }

  if (risk && risk !== "all") {
    whereClauses.push(`b.risk = $${paramIndex}`)
    params.push(risk)
    paramIndex++
  }

  if (startDate) {
    whereClauses.push(`b.found_date >= $${paramIndex}`)
    params.push(startDate)
    paramIndex++
  }

  if (endDate) {
    whereClauses.push(`b.found_date <= $${paramIndex}`)
    params.push(endDate)
    paramIndex++
  }

  if (responsible) {
    whereClauses.push(`(b.responsible_qa ILIKE $${paramIndex} OR b.responsible_dev ILIKE $${paramIndex})`)
    params.push(`%${responsible}%`)
    paramIndex++
  }

  const whereStatement = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : ""

  try {
    const result = await query(`SELECT b.*, s.name as service_name FROM bugs b LEFT JOIN services s ON b.service_id = s.id ${whereStatement} ORDER BY b.created_at DESC`, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar bugs:", error)
    return NextResponse.json({ error: "Erro interno do servidor ao buscar bugs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = bugSchema.parse(body)

    const result = await query(
      `INSERT INTO bugs (name, description, status, criticality, risk, test_id, service_id, user_story, gherkin, evidence, observations, responsible_qa, responsible_dev, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) RETURNING *`,
      [
        data.name,
        data.description,
        data.status,
        data.criticality,
        data.risk,
        data.test_id,
        data.service_id,
        data.user_story,
        data.gherkin,
        data.evidence,
        data.observations,
        data.responsible_qa,
        data.responsible_dev,
      ]
    )

    revalidatePath("/")
    return NextResponse.json({ success: true, bug: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar bug:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar bug" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = bugSchema.extend({ id: z.number() }).parse(body)

    const result = await query(
      `UPDATE bugs SET name = $1, description = $2, status = $3, criticality = $4, risk = $5, test_id = $6, service_id = $7, user_story = $8, gherkin = $9, evidence = $10, observations = $11, responsible_qa = $12, responsible_dev = $13 WHERE id = $14 RETURNING *`,
      [
        data.name,
        data.description,
        data.status,
        data.criticality,
        data.risk,
        data.test_id,
        data.service_id,
        data.user_story,
        data.gherkin,
        data.evidence,
        data.observations,
        data.responsible_qa,
        data.responsible_dev,
        id,
      ]
    )

    revalidatePath("/")
    return NextResponse.json({ success: true, bug: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar bug:", error)
    return NextResponse.json({ error: "Erro ao atualizar bug" }, { status: 500 })
  }
}

const deleteBugSchema = z.object({
  id: z.number(),
})

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = deleteBugSchema.parse(body)

    if (!id) {
      return NextResponse.json({ error: "O ID do bug é obrigatório." }, { status: 400 })
    }

    await query("DELETE FROM bugs WHERE id = $1", [id])

    revalidatePath("/")
    return NextResponse.json({ message: "Bug deletado com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar bug:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno do servidor ao deletar o bug" }, { status: 500 })
  }
}
