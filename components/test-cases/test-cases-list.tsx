import { query } from "@/lib/db"
import { TestCaseCard } from "./test-case-card"
import type { TestCase } from "@/lib/types"
import { Pagination } from "@/components/shared/pagination"

const ITEMS_PER_PAGE = 9

interface TestCasesListProps {
  currentPage: number
  filters: { [key: string]: string | undefined }
}

export async function TestCasesList({ currentPage, filters }: TestCasesListProps) {
  const { testCases, totalPages } = await getTestCases(currentPage, filters)
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testCases.map((testCase) => (
          <TestCaseCard key={testCase.id} testCase={testCase} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  )
}

async function getTestCases(
  page: number,
  filters: { [key: string]: string | undefined }
): Promise<{ testCases: TestCase[]; totalPages: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE
  const { query: searchQuery, status, service } = filters

  let whereClause = "WHERE 1=1"
  const queryParams: (string | number)[] = []

  if (searchQuery) {
    whereClause += ` AND (tc.name ILIKE $${queryParams.length + 1} OR tc.user_story ILIKE $${queryParams.length + 1})`
    queryParams.push(`%${searchQuery}%`)
  }
  if (status && status !== 'all') {
    whereClause += ` AND tc.status = $${queryParams.length + 1}`
    queryParams.push(status)
  }
  if (service && service !== 'all') {
    whereClause += ` AND s.name = $${queryParams.length + 1}`
    queryParams.push(service)
  }

  try {
    const countResult = await query(`SELECT COUNT(*) FROM test_cases tc JOIN services s ON tc.service_id = s.id ${whereClause}`, queryParams);
    const totalItems = Number(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    const result = await query(`
      SELECT tc.*, s.name as service_name FROM test_cases tc
      JOIN services s ON tc.service_id = s.id
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, ITEMS_PER_PAGE, offset]);

    return { testCases: result.rows as TestCase[], totalPages }
  } catch (error) {
    console.error("Error fetching test cases:", error)
    return { testCases: [], totalPages: 0 }
  }
}
