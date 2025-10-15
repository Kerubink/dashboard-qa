import { query } from "@/lib/db"
import { PerformancePlanCard } from "./performance-plan-card"
import type { PerformancePlan } from "@/lib/types"
import { Pagination } from "@/components/shared/pagination"

const ITEMS_PER_PAGE = 10

interface PerformancePlansListProps {
  currentPage: number
  filters: { [key: string]: string | undefined }
}

export async function PerformancePlansList({ currentPage, filters }: PerformancePlansListProps) {
  const { plans, totalPages } = await getPerformancePlans(currentPage, filters)
  if (plans.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum plano de performance encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Plano" para adicionar o primeiro plano</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {plans.map((plan) => (
          <PerformancePlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  )
}

async function getPerformancePlans(
  page: number,
  filters: { [key: string]: string | undefined }
): Promise<{ plans: PerformancePlan[]; totalPages: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE
  const { query: searchQuery, status, service } = filters

  let whereClause = "WHERE 1=1"
  const queryParams: (string | number)[] = []

  if (searchQuery) {
    whereClause += ` AND (pp.name ILIKE $${queryParams.length + 1} OR pp.description ILIKE $${queryParams.length + 1})`
    queryParams.push(`%${searchQuery}%`)
  }
  if (status && status !== 'all') {
    whereClause += ` AND pp.status = $${queryParams.length + 1}`
    queryParams.push(status)
  }
  if (service && service !== 'all') {
    whereClause += ` AND s.name = $${queryParams.length + 1}`
    queryParams.push(service)
  }

  try {
    const countResult = await query(`SELECT COUNT(*) FROM performance_plans pp JOIN services s ON pp.service_id = s.id ${whereClause}`, queryParams);
    const totalItems = Number(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    const result = await query(`
      SELECT pp.*, s.name as service_name FROM performance_plans pp
      JOIN services s ON pp.service_id = s.id
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, ITEMS_PER_PAGE, offset]);

    return { plans: result.rows as PerformancePlan[], totalPages }
  } catch (error) {
    console.error("Error fetching performance plans:", error)
    return { plans: [], totalPages: 0 }
  }
}
