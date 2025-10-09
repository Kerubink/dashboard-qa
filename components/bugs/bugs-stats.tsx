import { query } from "@/lib/db"
import { Bug, CheckCircle, Clock, AlertCircle, AlertTriangle, Shield } from "lucide-react"

export async function BugsStats() {
  const stats = await getBugsStats()

  const cards = [
    {
      title: "Total de Bugs",
      value: stats.total,
      icon: Bug,
      color: "text-chart-5",
    },
    {
      title: "Abertos",
      value: stats.open,
      icon: AlertCircle,
      color: "text-chart-5",
    },
    {
      title: "Em Progresso",
      value: stats.inProgress,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Resolvidos",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Críticos",
      value: stats.critical,
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "Alto Risco",
      value: stats.highRisk,
      icon: Shield,
      color: "text-warning",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div key={card.title} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

async function getBugsStats() {
  try {
    const [totalResult, openResult, inProgressResult, resolvedResult, criticalResult, highRiskResult] =
      await Promise.all([
        query("SELECT COUNT(*) as count FROM bugs"),
        query("SELECT COUNT(*) as count FROM bugs WHERE status = 'open'"),
        query("SELECT COUNT(*) as count FROM bugs WHERE status = 'in_progress'"),
        query("SELECT COUNT(*) as count FROM bugs WHERE status IN ('resolved', 'closed')"),
        query(
          "SELECT COUNT(*) as count FROM bugs WHERE criticality = 'critica' AND status NOT IN ('resolved', 'closed')",
        ),
        query(
          "SELECT COUNT(*) as count FROM bugs WHERE risk IN ('alto', 'critico') AND status NOT IN ('resolved', 'closed')",
        ),
      ])

    return {
      total: Number.parseInt(totalResult.rows[0]?.count || "0"),
      open: Number.parseInt(openResult.rows[0]?.count || "0"),
      inProgress: Number.parseInt(inProgressResult.rows[0]?.count || "0"),
      resolved: Number.parseInt(resolvedResult.rows[0]?.count || "0"),
      critical: Number.parseInt(criticalResult.rows[0]?.count || "0"),
      highRisk: Number.parseInt(highRiskResult.rows[0]?.count || "0"),
    }
  } catch (error) {
    console.error("Error fetching bugs stats:", error)
    return { total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0, highRisk: 0 }
  }
}
