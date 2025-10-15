import { query } from "@/lib/db"
import { ImprovementCard } from "./improvement-card"
import type { Improvement } from "@/lib/types"
import { Pagination } from "@/components/shared/pagination"

const ITEMS_PER_PAGE = 10

interface ImprovementsListProps {
  currentPage: number
  filters: { [key: string]: string | undefined }
}

export async function ImprovementsList({ currentPage, filters }: ImprovementsListProps) {
  const { improvements, totalPages } = await getImprovements(currentPage, filters)

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
    <>
      <div className="space-y-4">
        {improvements.map((improvement) => (
          <ImprovementCard key={improvement.id} improvement={improvement} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </>
  )
}

async function getImprovements(
  page: number,
  filters: { [key: string]: string | undefined }
): Promise<{ improvements: Improvement[]; totalPages: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE
  const { query: searchQuery, status, area } = filters

  let whereClause = "WHERE 1=1"
  const queryParams: (string | number)[] = []

  if (searchQuery) {
    whereClause += ` AND (name ILIKE $${queryParams.length + 1} OR description ILIKE $${queryParams.length + 1})`
    queryParams.push(`%${searchQuery}%`)
  }
  if (status && status !== 'all') {
    whereClause += ` AND status = $${queryParams.length + 1}`
    queryParams.push(status)
  }
  if (area && area !== 'all') {
    whereClause += ` AND area = $${queryParams.length + 1}`
    queryParams.push(area)
  }

  try {
    const countResult = await query(`SELECT COUNT(*) FROM improvements ${whereClause}`, queryParams);
    const totalItems = Number(countResult.rows[0].count)
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    const result = await query(`
      SELECT * FROM improvements
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, ITEMS_PER_PAGE, offset]);

    return { improvements: result.rows as Improvement[], totalPages }
  } catch (error) {
    console.error("Error fetching improvements:", error)
    return { improvements: [], totalPages: 0 }
  }
}
