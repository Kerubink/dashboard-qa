import { query } from "@/lib/db";
import { TestCard } from "./test-card"
import type { Test } from "@/lib/types"
import { Pagination } from "@/components/shared/pagination"

const ITEMS_PER_PAGE = 9

interface TestsListProps {
  currentPage: number
  filters: { [key: string]: string | undefined }
}

export async function TestsList({ currentPage, filters }: TestsListProps) {
  const { tests, totalPages } = await getTests(currentPage, filters);
  if (tests.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum teste encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Teste" para adicionar o primeiro teste</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  )
}

async function getTests(
  page: number,
  filters: { [key: string]: string | undefined }
): Promise<{ tests: Test[]; totalPages: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const { query: searchQuery, type, result: resultFilter, execution_type, startDate, endDate, service } = filters

  let whereClause = "WHERE 1=1"
  const queryParams: (string | number)[] = []

  if (searchQuery) {
    whereClause += ` AND (t.name ILIKE $${queryParams.length + 1} OR t.description ILIKE $${queryParams.length + 1})`
    queryParams.push(`%${searchQuery}%`)
  }
  if (type && type !== 'all') {
    whereClause += ` AND t.type = $${queryParams.length + 1}`
    queryParams.push(type)
  }
  if (resultFilter && resultFilter !== 'all') {
    whereClause += ` AND t.result = $${queryParams.length + 1}`
    queryParams.push(resultFilter)
  }
  if (execution_type && execution_type !== 'all') {
    whereClause += ` AND t.execution_type = $${queryParams.length + 1}`
    queryParams.push(execution_type)
  }
  if (startDate) {
    whereClause += ` AND t.test_date >= $${queryParams.length + 1}`
    queryParams.push(startDate)
  }
  if (endDate) {
    whereClause += ` AND t.test_date <= $${queryParams.length + 1}`
    queryParams.push(endDate)
  }
  if (service && service !== 'all') {
    whereClause += ` AND s.name = $${queryParams.length + 1}`
    queryParams.push(service)
  }

  try {
    const countResult = await query(`SELECT COUNT(*) FROM tests t JOIN services s ON t.service_id = s.id ${whereClause}`, queryParams);
    const totalItems = Number(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    const result = await query(`
      SELECT t.*, s.name as service_name FROM tests t
      JOIN services s ON t.service_id = s.id
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, ITEMS_PER_PAGE, offset]);

    return { tests: result.rows as Test[], totalPages }
  } catch (error) {
    console.error("Error fetching tests:", error)
    return { tests: [], totalPages: 0 }
  }
}
