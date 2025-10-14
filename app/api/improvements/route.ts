import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const improvementSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().optional(),
  user_story: z.string().optional(),
  evidence: z.string().optional(),
  status: z.string().min(1, "O status é obrigatório"),
  observations: z.string().optional(),
  service_id: z.number().min(1, "O serviço é obrigatório"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = improvementSchema.parse(body)

    const result = await query(
      `INSERT INTO improvements (name, description, user_story, evidence, status, observations, service_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.name, data.description, data.user_story, data.evidence, data.status, data.observations, data.service_id]
    )

    revalidatePath("/")
    return NextResponse.json({ success: true, improvement: result.rows[0] })
  } catch (error) {
    console.error("Erro ao criar melhoria:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar melhoria" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = improvementSchema.extend({ id: z.number() }).parse(body)

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }

    const result = await query(
      `UPDATE improvements SET
        name = $1, description = $2, user_story = $3, evidence = $4,
        status = $5, observations = $6, service_id = $7
       WHERE id = $8 RETURNING *`,
      [data.name, data.description, data.user_story, data.evidence, data.status, data.observations, data.service_id, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Melhoria não encontrada" }, { status: 404 })
    }

    revalidatePath("/")
    return NextResponse.json({ success: true, improvement: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar melhoria:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar melhoria" }, { status: 500 })
  }
}

const deleteImprovementSchema = z.object({
  id: z.number(),
})

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { id } = deleteImprovementSchema.parse(body)

    if (!id) {
      return NextResponse.json({ error: "O ID da melhoria é obrigatório." }, { status: 400 })
    }

    await query("DELETE FROM improvements WHERE id = $1", [id])

    revalidatePath("/")
    return NextResponse.json({ message: "Melhoria deletada com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar melhoria:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro interno do servidor ao deletar a melhoria" }, { status: 500 })
  }
}