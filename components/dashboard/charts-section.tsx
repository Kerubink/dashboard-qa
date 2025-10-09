import { getTestsByType, getTestsByResult, getCoverageByService, getFunnelData } from "@/lib/db"
import { TestsByTypeChart } from "./charts/tests-by-type-chart"
import { TestsByResultChart } from "./charts/tests-by-result-chart"
import { CoverageByServiceChart } from "./charts/coverage-by-service-chart"
import { TestsFunnelChart } from "./charts/tests-funnel-chart"

export async function ChartsSection() {
  const [testsByType, testsByResult, coverageByService, funnelData] = await Promise.all([
    getTestsByType(),
    getTestsByResult(),
    getCoverageByService(),
    getFunnelData(),
  ])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TestsByTypeChart data={testsByType} />
      <TestsByResultChart data={testsByResult} />
      <CoverageByServiceChart data={coverageByService} />
      <TestsFunnelChart data={funnelData} />
    </div>
  )
}
