import { query } from "@/lib/db"
import { TestCaseCard } from "./test-case-card"
import type { TestCase } from "@/lib/types"

export async function TestCasesList() {
  const testCases = await getTestCases()

  if (testCases.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum caso de teste encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">
          Clique em "Novo Caso de Teste" para adicionar o primeiro caso
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {testCases.map((testCase) => (
        <TestCaseCard key={testCase.id} testCase={testCase} />
      ))}
    </div>
  )
}

async function getTestCases(): Promise<TestCase[]> {
  try {
    const result = await query(`
      SELECT * FROM test_cases
      ORDER BY created_at DESC
      LIMIT 50
    `)
    return result.rows as TestCase[]
  } catch (error) {
    console.error("Error fetching test cases:", error)
    return []
  }
}
