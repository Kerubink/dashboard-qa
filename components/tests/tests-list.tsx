import { query } from "@/lib/db"
import { TestCard } from "./test-card"
import type { Test } from "@/lib/types"

export async function TestsList() {
  const tests = await getTests()

  if (tests.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum teste encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Teste" para adicionar o primeiro teste</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  )
}

async function getTests(): Promise<Test[]> {
  try {
    const result = await query(`
      SELECT * FROM tests
      ORDER BY created_at DESC
      LIMIT 50
    `)
    return result.rows as Test[]
  } catch (error) {
    console.error("Error fetching tests:", error)
    return []
  }
}
