import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const testCaseSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  user_story: z.string().optional(),
  gherkin: z.string().optional(),
  test_data: z.string().optional(),
  status: z.string().min(1, "O status é obrigatório"),
  is_automated: z.boolean(),
  observations: z.string().optional(),
  service_id: z.number().min(1, "O serviço é obrigatório"),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format")
  const getNextId = searchParams.get("nextId")

  try {
    if (format === "list") {
      const result = await query("SELECT id, name FROM test_cases ORDER BY name")
      return NextResponse.json({ testCases: result.rows })
    } else {
      const result = await query("SELECT * FROM test_cases ORDER BY created_at DESC")
      if (getNextId === "true") {
        // Busca o próximo valor diretamente da sequência do PostgreSQL para evitar inconsistências com registros deletados.
        // A função pg_get_serial_sequence obtém o nome da sequência para a coluna 'id' da tabela 'test_cases'.
        // A função nextval avança a sequência e retorna o novo valor.
        const nextIdResult = await query("SELECT nextval(pg_get_serial_sequence('test_cases', 'id')) as next_id")
        const nextId = nextIdResult.rows[0]?.next_id || 1
        return NextResponse.json({ nextId })
      }
      return NextResponse.json(result.rows)
    }
  } catch (error) {
    console.error("Erro ao buscar casos de teste:", error)
    return NextResponse.json({ error: "Erro interno do servidor ao buscar casos de teste" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = testCaseSchema.parse(body)

    const result = await query(
      `INSERT INTO test_cases (name, user_story, gherkin, test_data, status, is_automated, observations, service_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data.name, data.user_story, data.gherkin, data.test_data, data.status, data.is_automated, data.observations, data.service_id]
    )

    revalidatePath("/")
    return NextResponse.json({ success: true, testCase: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar caso de teste:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar caso de teste" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = testCaseSchema.extend({ id: z.number() }).parse(body)

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }

    const result = await query(
      `UPDATE test_cases SET
        name = $1, user_story = $2, gherkin = $3, test_data = $4, status = $5,
        is_automated = $6, observations = $7, service_id = $8
       WHERE id = $9 RETURNING *`,
      [data.name, data.user_story, data.gherkin, data.test_data, data.status, data.is_automated, data.observations, data.service_id, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Caso de teste não encontrado" }, { status: 404 })
    }

    revalidatePath("/")
    return NextResponse.json({ success: true, testCase: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar caso de teste:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar caso de teste" }, { status: 500 })
  }
}

const deleteTestCaseSchema = z.object({
  id: z.number(),
})

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = deleteTestCaseSchema.parse(body)

    if (!id) {
      return NextResponse.json({ error: "O ID do caso de teste é obrigatório." }, { status: 400 })
    }

    await query("DELETE FROM test_cases WHERE id = $1", [id])

    revalidatePath("/")
    return NextResponse.json({ message: "Caso de teste deletado com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar caso de teste:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno do servidor ao deletar o caso de teste" }, { status: 500 })
  }
}