import { query } from "@/lib/db"
import { PerformancePlanCard } from "./performance-plan-card"
import type { PerformancePlan } from "@/lib/types"

export async function PerformancePlansList() {
  const plans = await getPerformancePlans()

  if (plans.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum plano de performance encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Plano" para adicionar o primeiro plano</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <PerformancePlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}

async function getPerformancePlans(): Promise<PerformancePlan[]> {
  try {
    const result = await query(`
      SELECT * FROM performance_plans
      ORDER BY created_at DESC
      LIMIT 50
    `)
    return result.rows as PerformancePlan[]
  } catch (error) {
    console.error("Error fetching performance plans:", error)
    return []
  }
}
