import { query } from "@/lib/db"
import { ImprovementCard } from "./improvement-card"
import type { Improvement } from "@/lib/types"

export async function ImprovementsList() {
  const improvements = await getImprovements()

  if (improvements.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhuma melhoria encontrada</p>
        <p className="text-sm text-muted-foreground mt-2">
          Clique em "Nova Melhoria" para adicionar a primeira melhoria
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {improvements.map((improvement) => (
        <ImprovementCard key={improvement.id} improvement={improvement} />
      ))}
    </div>
  )
}

async function getImprovements(): Promise<Improvement[]> {
  try {
    const result = await query(`
      SELECT * FROM improvements
      ORDER BY created_at DESC
      LIMIT 50
    `)
    return result.rows as Improvement[]
  } catch (error) {
    console.error("Error fetching improvements:", error)
    return []
  }
}
