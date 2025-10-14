import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const testSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  result: z.string().min(1, "O resultado é obrigatório"),
  type: z.string().min(1, "O tipo é obrigatório"),
  test_case_id: z.number().min(1, "O caso de teste é obrigatório"),
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
      `INSERT INTO tests (name, description, result, type, test_case_id, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [data.name, data.description, data.result, data.type, data.test_case_id]
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
      `UPDATE tests SET name = $1, description = $2, result = $3, type = $4, test_case_id = $5
       WHERE id = $6 RETURNING *`,
      [data.name, data.description, data.result, data.type, data.test_case_id, id]
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