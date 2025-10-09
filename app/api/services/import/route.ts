import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { services } = await request.json()

    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: "Nenhum serviço fornecido" }, { status: 400 })
    }

    const insertPromises = services.map((service) =>
      query(
        `INSERT INTO services (
          name, description, owner, repository, documentation,
          status, coverage_percentage, observations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          service.name,
          service.description,
          service.owner,
          service.repository,
          service.documentation,
          service.status,
          service.coverage_percentage,
          service.observations,
        ],
      ),
    )

    await Promise.all(insertPromises)

    return NextResponse.json({
      success: true,
      count: services.length,
      message: `${services.length} serviços importados com sucesso`,
    })
  } catch (error) {
    console.error("Erro ao importar serviços:", error)
    return NextResponse.json({ error: "Erro ao importar serviços" }, { status: 500 })
  }
}
