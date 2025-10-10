import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(`SELECT * FROM services ORDER BY name`)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar serviços:", error)
    return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO services (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const service = await request.json()
    if (!service.id) {
      return NextResponse.json({ error: "ID é obrigatório para atualizar" }, { status: 400 })
    }
    const result = await query(
      `UPDATE services SET
        name = $1,
        description = $2,
        owner = $3,
        repository = $4,
        documentation = $5,
        status = $6,
        coverage_percentage = $7,
        observations = $8
      WHERE id = $9 RETURNING *`,
      [
        service.name,
        service.description,
        service.owner,
        service.repository,
        service.documentation,
        service.status,
        service.coverage_percentage,
        service.observations,
        service.id
      ]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true, service: result.rows[0] })
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error)
    return NextResponse.json({ error: "Erro ao atualizar serviço" }, { status: 500 })
  }
}
