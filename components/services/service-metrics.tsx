import { query } from "@/lib/db"
import { FlaskConical, Bug, FileCheck, TrendingUp, CheckCircle, XCircle } from "lucide-react"

interface ServiceMetricsProps {
  serviceId: string
}

export async function ServiceMetrics({ serviceId }: ServiceMetricsProps) {
  const metrics = await getServiceMetrics(serviceId)

  const cards = [
    {
      title: "Total de Testes",
      value: metrics.totalTests,
      icon: FlaskConical,
      color: "text-chart-1",
    },
    {
      title: "Testes Aprovados",
      value: metrics.passedTests,
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Testes Falhados",
      value: metrics.failedTests,
      icon: XCircle,
      color: "text-chart-5",
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
      title: "Cobertura",
      value: `${metrics.coverage}%`,
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">KPIs do Serviço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon

            return (
              <div key={card.title} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição de Resultados</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Aprovados</span>
            <div className="flex items-center gap-3 flex-1 max-w-md ml-4">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{
                    width: `${metrics.totalTests > 0 ? (metrics.passedTests / metrics.totalTests) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12 text-right">{metrics.passedTests}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Falhados</span>
            <div className="flex items-center gap-3 flex-1 max-w-md ml-4">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-5 rounded-full transition-all"
                  style={{
                    width: `${metrics.totalTests > 0 ? (metrics.failedTests / metrics.totalTests) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12 text-right">{metrics.failedTests}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quebrados</span>
            <div className="flex items-center gap-3 flex-1 max-w-md ml-4">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{
                    width: `${metrics.totalTests > 0 ? (metrics.brokenTests / metrics.totalTests) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-12 text-right">{metrics.brokenTests}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function getServiceMetrics(serviceId: string) {
  try {
    const [testsResult, bugsResult, testCasesResult] = await Promise.all([
      query(
        `
      SELECT 
        COUNT(t.id) as total,
        COUNT(CASE WHEN t.result = 'aprovado' THEN 1 END) as passed,
        COUNT(CASE WHEN t.result = 'reprovado' THEN 1 END) as failed,
        COUNT(CASE WHEN t.result = 'bloqueado' THEN 1 END) as broken
      FROM tests t
      JOIN test_cases tc ON t.test_case_id = tc.id
      WHERE tc.service_id = $1
    `,
        [serviceId],
      ),
      query("SELECT COUNT(*) as count FROM bugs WHERE service_id = $1 AND status = 'open'", [serviceId]),
      query("SELECT COUNT(*) as count FROM test_cases WHERE service_id = $1", [serviceId]),
    ])

    const totalTests = Number.parseInt(testsResult.rows[0]?.total || "0")
    const passedTests = Number.parseInt(testsResult.rows[0]?.passed || "0")
    const failedTests = Number.parseInt(testsResult.rows[0]?.failed || "0")
    const brokenTests = Number.parseInt(testsResult.rows[0]?.broken || "0")
    const openBugs = Number.parseInt(bugsResult.rows[0]?.count || "0")
    const totalTestCases = Number.parseInt(testCasesResult.rows[0]?.count || "0")

    // Cobertura: (testes executados / total de casos de teste) * 100
    // Garante que a cobertura reflita quantos casos de teste têm pelo menos um teste executado.
    const executedTestCasesResult = await query("SELECT COUNT(DISTINCT test_case_id) as count FROM tests t JOIN test_cases tc ON t.test_case_id = tc.id WHERE tc.service_id = $1", [serviceId]);
    const executedTestCasesCount = Number.parseInt(executedTestCasesResult.rows[0]?.count || "0");
    const coverage = totalTestCases > 0 ? Math.round((executedTestCasesCount / totalTestCases) * 100) : 0

    return {
      totalTests,
      passedTests,
      failedTests,
      brokenTests,
      openBugs,
      totalTestCases,
      coverage,
    }
  } catch (error) {
    console.error("Error fetching service metrics:", error)
    return {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      brokenTests: 0,
      openBugs: 0,
      totalTestCases: 0,
      coverage: 0,
    }
  }
}
