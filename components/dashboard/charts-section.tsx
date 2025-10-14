import { TestsByTypeChart } from "./charts/tests-by-type-chart"
import { TestsByResultChart } from "./charts/tests-by-result-chart"
import { CoverageByServiceChart } from "./charts/coverage-by-service-chart"
import { TestsFunnelChart } from "./charts/tests-funnel-chart"

interface ChartsSectionProps {
  testsByType: any[]
  testsByResult: any[]
  coverageByService: {
    data: any[]
    services: string[]
  }
  funnelData: any[]
}

export function ChartsSection(props: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TestsByTypeChart data={props.testsByType} />
      <TestsByResultChart data={props.testsByResult} />
      <CoverageByServiceChart data={props.coverageByService.data} services={props.coverageByService.services} />
      <TestsFunnelChart data={props.funnelData} />
    </div>
  )
}
