export interface Service {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface TestCase {
  id: number
  name: string
  service_id: number
  user_story: string
  gherkin: string
  test_data: string
  status: "pending" | "done" | "blocked"
  is_automated: boolean
  observations: string
  created_at: string
  updated_at: string
}

export interface Test {
  id: number
  name: string
  description: string
  test_case_id: number | null
  service_id: number
  type: "unitario" | "funcional" | "performance" | "contrato" | "regressao" | "exploratorio"
  result: "aprovado" | "falho" | "quebrado" | "pending"
  execution_date: string
  execution_type: "manual" | "automatico"
  execution_location: string
  execution_method: string
  test_data: string
  jira_link: string
  bug_link: string
  evidence: string
  responsible_qa: string
  responsible_dev: string
  created_at: string
  updated_at: string
}

export interface Bug {
  id: number
  name: string
  description: string
  test_id: number | null
  service_id: number
  user_story: string
  gherkin: string
  evidence: string
  evidence_link?: string
  status: "open" | "in_progress" | "resolved" | "closed"
  criticality: "baixa" | "media" | "alta" | "critica"
  risk: "baixo" | "medio" | "alto" | "critico"
  observations: string
  found_date: string
  resolved_date: string | null
  retested_date: string | null
  responsible_qa: string
  responsible_dev: string
  created_at: string
  updated_at: string
}

export interface Improvement {
  id: number
  name: string
  description: string
  service_id: number
  user_story: string
  evidence: string
  status: "proposed" | "approved" | "in_progress" | "completed" | "rejected"
  observations: string
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface PerformancePlan {
  id: number
  name: string
  description: string
  service_id: number
  test_type: string
  target_metrics: string
  test_data: string
  execution_date: string | null
  results: string
  status: "planned" | "in_progress" | "completed" | "failed"
  observations: string
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface DashboardMetrics {
  totalTests: number
  totalBugs: number
  totalTestCases: number
  overallCoverage: number
  testsByType: { type: string; count: number }[]
  testsByResult: { result: string; count: number }[]
  bugsByStatus: { status: string; count: number }[]
  coverageByService: { service: string; coverage: number }[]
}
