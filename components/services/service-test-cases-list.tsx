import { query } from "@/lib/db"
import type { TestCase } from "@/lib/types"
import { TestCaseCard } from "@/components/test-cases/test-case-card"

async function getTestCasesForService(serviceId: string): Promise<TestCase[]> {
  try {
    const result = await query(
      `SELECT * FROM test_cases WHERE service_id = $1 ORDER BY created_at DESC`,
      [serviceId]
    )
    return result.rows as TestCase[]
  } catch (error) {
    console.error("Error fetching test cases for service:", error)
    return []
  }
}

export async function ServiceTestCasesList({ serviceId }: { serviceId: string }) {
  const testCases = await getTestCasesForService(serviceId)

  if (testCases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum caso de teste encontrado para este serviço.</p>
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