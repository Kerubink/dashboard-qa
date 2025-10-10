import { Bug, FileCheck, FlaskConical, Server, Target } from "lucide-react"

interface MetricsGridProps {
  metrics: {
    totalTests: number;
    openBugs: number;
    totalTestCases: number;
    averageCoverage: number;
    totalServices: number;
  };
}
export function MetricsGrid({ metrics }: MetricsGridProps) {
  const cards = [
    {
      title: "Testes Executados",
      value: metrics.totalTests,
      icon: FlaskConical,
      color: "text-chart-1",
    },
    {
      title: "Bugs Abertos",
      value: metrics.openBugs,
      icon: Bug,
      color: "text-chart-5",
    },
    {
      title: "Casos de Teste",
      value: metrics.totalTestCases,
      icon: FileCheck,
      color: "text-chart-3",
    },
    {
      title: "Cobertura Geral",
      value: `${metrics.averageCoverage}%`,
      icon: Target,
      color: "text-chart-2",
    },
    {
      title: "Serviços Cobertos",
      value: metrics.totalServices,
      icon: Server,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                <Icon className="w-5 h-5" />
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
