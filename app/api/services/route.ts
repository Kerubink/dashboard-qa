import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT id, name FROM services ORDER BY name")
    return NextResponse.json({ services: result.rows })
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor ao buscar serviços" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json()

    if (!name || name.trim().length < 3) {
      return NextResponse.json({ error: "O nome do serviço é obrigatório e deve ter no mínimo 3 caracteres." }, { status: 400 })
    }

    const result = await query(
      "INSERT INTO services (name, description) VALUES ($1, $2) RETURNING *",
      [name, description || null]
    )

    return NextResponse.json({ service: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar serviço:", error)
    return NextResponse.json({ error: "Erro interno do servidor ao criar serviço" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID do serviço é obrigatório para atualização." }, { status: 400 })
    }

    await query("UPDATE services SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3", [name, description, id])
    return NextResponse.json({ message: "Serviço atualizado com sucesso." }, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error)
    return NextResponse.json({ error: "Erro interno do servidor ao atualizar serviço" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID do serviço é obrigatório para exclusão." }, { status: 400 })
    }

    await query("DELETE FROM services WHERE id = $1", [id])

    return NextResponse.json({ message: "Serviço excluído com sucesso." }, { status: 200 })
  } catch (error) {
    console.error("Erro ao excluir serviço:", error)
    return NextResponse.json({ error: "Erro interno do servidor ao excluir serviço" }, { status: 500 })
  }
}