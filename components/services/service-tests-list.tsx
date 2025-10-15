import { query } from "@/lib/db"
import type { Test } from "@/lib/types"
import { TestCard } from "@/components/tests/test-card"

async function getTestsForService(serviceId: string): Promise<Test[]> {
  try {
    // Precisamos fazer um JOIN para encontrar os testes baseados no service_id do caso de teste associado.
    const result = await query(
      `
      SELECT t.*, tc.name as test_case_name, s.name as service_name
      FROM tests t
      JOIN test_cases tc ON t.test_case_id = tc.id
      JOIN services s ON tc.service_id = s.id
      WHERE s.id = $1
      ORDER BY t.created_at DESC
    `,
      [serviceId]
    )
    return result.rows as Test[]
  } catch (error) {
    console.error("Error fetching tests for service:", error)
    return []
  }
}

export async function ServiceTestsList({ serviceId }: { serviceId: anystring }) {
  const tests = await getTestsForService(serviceId)

  if (tests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum teste encontrado para este serviço.</p>
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