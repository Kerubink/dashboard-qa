import { getDashboardStats } from "@/lib/db"
import { TrendingUp, TrendingDown, FlaskConical, Bug, FileCheck, Target, Server } from "lucide-react"

export async function MetricsGrid() {
  const metrics = await getDashboardStats()

  const cards = [
    {
      title: "Total de Testes",
      value: metrics.totalTests,
      change: "+12%",
      trend: "up",
      icon: FlaskConical,
      color: "text-chart-1",
    },
    {
      title: "Bugs Abertos",
      value: metrics.openBugs,
      change: "-8%",
      trend: "down",
      icon: Bug,
      color: "text-chart-5",
    },
    {
      title: "Casos de Teste",
      value: metrics.totalTestCases,
      change: "+5%",
      trend: "up",
      icon: FileCheck,
      color: "text-chart-3",
    },
    {
      title: "Cobertura Geral",
      value: `${metrics.averageCoverage}%`,
      change: "+3%",
      trend: "up",
      icon: Target,
      color: "text-chart-2",
    },
    {
      title: "Serviços Cobertos",
      value: metrics.totalServices,
      change: "+2",
      trend: "up",
      icon: Server,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown

        return (
          <div
            key={card.title}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${card.trend === "up" ? "text-success" : "text-chart-5"}`}
              >
                <TrendIcon className="w-4 h-4" />
                {card.change}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1">{card.value}</h3>
            <p className="text-sm text-muted-foreground">{card.title}</p>
          </div>
        )
      })}
    </div>
  )
}
