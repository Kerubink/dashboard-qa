import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const testSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  result: z.string().min(1, "O resultado é obrigatório"),
  type: z.string().min(1, "O tipo é obrigatório"),
  execution_type: z.string().optional(),
  execution_location: z.string().optional().nullable(),
  execution_method: z.string().optional().nullable(),
  responsible_qa: z.string().optional().nullable(),
  responsible_dev: z.string().optional().nullable(),
  jira_link: z.string().optional().nullable(),
  bug_link: z.string().optional().nullable(),
  evidence: z.string().optional().nullable(),
  test_data: z.string().optional().nullable(),
  service_id: z.number().min(1, "O serviço é obrigatório"),
  test_case_id: z.number().nullable().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format")

  try {
    if (format === "list") {
      const result = await query("SELECT id, name FROM tests ORDER BY name")
      return NextResponse.json({ tests: result.rows })
    } else {
      const result = await query("SELECT * FROM tests ORDER BY created_at DESC")
      return NextResponse.json(result.rows)
    }
  } catch (error) {
    console.error("Erro ao buscar testes:", error)
    return NextResponse.json({ error: "Erro interno do servidor ao buscar testes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = testSchema.parse(body)

    const result = await query(
      `INSERT INTO tests (name, description, result, type, test_case_id, service_id, execution_type, execution_location, execution_method, responsible_qa, responsible_dev, jira_link, bug_link, evidence, test_data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()) RETURNING *`,
      [data.name, data.description, data.result, data.type, data.test_case_id, data.service_id, data.execution_type, data.execution_location, data.execution_method, data.responsible_qa, data.responsible_dev, data.jira_link, data.bug_link, data.evidence, data.test_data]
    )

    revalidatePath("/")
    return NextResponse.json({ success: true, test: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar teste:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar teste" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = testSchema.extend({ id: z.number() }).parse(body)

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }

    const result = await query(
      `UPDATE tests SET name = $1, description = $2, result = $3, type = $4, test_case_id = $5, service_id = $6, execution_type = $7,
        execution_location = $8, execution_method = $9, responsible_qa = $10, responsible_dev = $11, jira_link = $12,
        bug_link = $13, evidence = $14, test_data = $15, updated_at = NOW()
       WHERE id = $16 RETURNING *`,
      [data.name, data.description, data.result, data.type, data.test_case_id, data.service_id, data.execution_type, data.execution_location, data.execution_method, data.responsible_qa, data.responsible_dev, data.jira_link, data.bug_link, data.evidence, data.test_data, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Teste não encontrado" }, { status: 404 })
    }

    revalidatePath("/")
    return NextResponse.json({ success: true, test: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar teste:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar teste" }, { status: 500 })
  }
}

const deleteTestSchema = z.object({
  id: z.number(),
})

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = deleteTestSchema.parse(body)

    if (!id) {
      return NextResponse.json({ error: "O ID do teste é obrigatório." }, { status: 400 })
    }

    await query("DELETE FROM tests WHERE id = $1", [id])

    revalidatePath("/")
    return NextResponse.json({ message: "Teste deletado com sucesso." }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar teste:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno do servidor ao deletar o teste." }, { status: 500 })
  }
}