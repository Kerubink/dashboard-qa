import { query } from "@/lib/db"
import { BugCard } from "./bug-card"
import type { Bug } from "@/lib/types"

export async function BugsList() {
  const bugs = await getBugs()

  if (bugs.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum bug encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Bug" para adicionar o primeiro bug</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <BugCard key={bug.id} bug={bug} />
      ))}
    </div>
  )
}

async function getBugs(): Promise<Bug[]> {
  try {
    const result = await query(`
      SELECT * FROM bugs
      ORDER BY 
        CASE status
          WHEN 'open' THEN 1
          WHEN 'in_progress' THEN 2
          WHEN 'resolved' THEN 3
          WHEN 'closed' THEN 4
        END,
        created_at DESC
      LIMIT 50
    `)
    return result.rows as Bug[]
  } catch (error) {
    console.error("Error fetching bugs:", error)
    return []
  }
}
