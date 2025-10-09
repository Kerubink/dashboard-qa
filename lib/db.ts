import { sql } from "@vercel/postgres"
import {
  getMockTestsByType,
  getMockTestsByResult,
  getMockCoverageByService,
  getMockFunnelData,
  getMockStats,
  mockTests,
  mockBugs,
  mockTestCases,
  mockServices,
} from "./mock-data"

// Check if database is available
const isDatabaseAvailable = () => {
  return !!process.env.POSTGRES_URL
}

export async function query(text: string, params?: any[]) {
  if (!isDatabaseAvailable()) {
    console.log("[v0] Database not available, using mock data")
    throw new Error("Database not available")
  }

  const start = Date.now()

  // Convert parameterized query to @vercel/postgres format
  let processedQuery = text
  if (params && params.length > 0) {
    params.forEach((param, index) => {
      processedQuery = processedQuery.replace(`$${index + 1}`, `'${param}'`)
    })
  }

  const res = await sql.query(processedQuery)
  const duration = Date.now() - start

  console.log("[v0] Executed query", { text, duration, rows: res.rowCount })
  return res
}

// Helper functions that return mock data when database is not available
export async function getTestsByType() {
  if (!isDatabaseAvailable()) {
    return getMockTestsByType()
  }

  try {
    const result = await query(`
      SELECT type, COUNT(*) as count
      FROM tests
      GROUP BY type
      ORDER BY count DESC
    `)
    return result.rows.map((row) => ({
      type: row.type,
      count: Number.parseInt(row.count),
    }))
  } catch (error) {
    console.error("Error fetching tests by type:", error)
    return getMockTestsByType()
  }
}

export async function getTestsByResult() {
  if (!isDatabaseAvailable()) {
    return getMockTestsByResult()
  }

  try {
    const result = await query(`
      SELECT result, COUNT(*) as count
      FROM tests
      GROUP BY result
      ORDER BY count DESC
    `)
    return result.rows.map((row) => ({
      result: row.result,
      count: Number.parseInt(row.count),
    }))
  } catch (error) {
    console.error("Error fetching tests by result:", error)
    return getMockTestsByResult()
  }
}

export async function getCoverageByService() {
  if (!isDatabaseAvailable()) {
    return getMockCoverageByService()
  }

  try {
    const result = await query(`
      SELECT 
        s.name as service,
        COUNT(DISTINCT tc.id) as covered,
        (SELECT COUNT(*) FROM test_cases WHERE service_id = s.id) as total
      FROM services s
      LEFT JOIN test_cases tc ON tc.service_id = s.id
      LEFT JOIN tests t ON t.test_case_id = tc.id
      GROUP BY s.id, s.name
      ORDER BY s.name
    `)
    return result.rows.map((row) => ({
      service: row.service,
      coverage: row.total > 0 ? Math.round((Number.parseInt(row.covered) / Number.parseInt(row.total)) * 100) : 0,
    }))
  } catch (error) {
    console.error("Error fetching coverage by service:", error)
    return getMockCoverageByService()
  }
}

export async function getFunnelData() {
  if (!isDatabaseAvailable()) {
    return getMockFunnelData()
  }

  try {
    const [testCases, tests, passed, bugs] = await Promise.all([
      query("SELECT COUNT(*) as count FROM test_cases"),
      query("SELECT COUNT(*) as count FROM tests"),
      query("SELECT COUNT(*) as count FROM tests WHERE result = 'aprovado'"),
      query("SELECT COUNT(*) as count FROM bugs"),
    ])

    return [
      { stage: "Casos de Teste", value: Number.parseInt(testCases.rows[0]?.count || "0") },
      { stage: "Testes Executados", value: Number.parseInt(tests.rows[0]?.count || "0") },
      { stage: "Testes Aprovados", value: Number.parseInt(passed.rows[0]?.count || "0") },
      { stage: "Bugs Encontrados", value: Number.parseInt(bugs.rows[0]?.count || "0") },
    ]
  } catch (error) {
    console.error("Error fetching funnel data:", error)
    return getMockFunnelData()
  }
}

export async function getDashboardStats() {
  if (!isDatabaseAvailable()) {
    return getMockStats()
  }

  try {
    const [tests, bugs, testCases, services, servicesCount] = await Promise.all([
      query("SELECT COUNT(*) as total, result FROM tests GROUP BY result"),
      query("SELECT COUNT(*) as count FROM bugs WHERE status = 'aberto'"),
      query("SELECT COUNT(*) as count FROM test_cases"),
      query("SELECT AVG(coverage) as avg FROM services"),
      query("SELECT COUNT(*) as count FROM services"),
    ])

    const totalTests = tests.rows.reduce((acc, row) => acc + Number.parseInt(row.total), 0)
    const passedTests = tests.rows.find((r) => r.result === "aprovado")?.total || 0
    const failedTests = tests.rows.find((r) => r.result === "falho")?.total || 0
    const brokenTests = tests.rows.find((r) => r.result === "quebrado")?.total || 0

    return {
      totalTests,
      passedTests: Number.parseInt(passedTests),
      failedTests: Number.parseInt(failedTests),
      brokenTests: Number.parseInt(brokenTests),
      openBugs: Number.parseInt(bugs.rows[0]?.count || "0"),
      totalTestCases: Number.parseInt(testCases.rows[0]?.count || "0"),
      averageCoverage: Math.round(Number.parseFloat(services.rows[0]?.avg || "0")),
      totalServices: Number.parseInt(servicesCount.rows[0]?.count || "0"),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return getMockStats()
  }
}

export async function getAlerts() {
  if (!isDatabaseAvailable()) {
    return [
      {
        id: 1,
        type: "bug",
        severity: "critical",
        title: "Bug crítico não resolvido há 15 dias",
        description: "Erro ao processar pagamento com cartão expirado",
        item_id: 1,
        days_open: 15,
      },
      {
        id: 2,
        type: "test",
        severity: "warning",
        title: "Teste sem atualização há 30 dias",
        description: "Teste de carga - 1000 usuários",
        item_id: 2,
        days_open: 30,
      },
    ]
  }

  try {
    // Get critical bugs not resolved
    const criticalBugs = await query(`
      SELECT id, name, description, created_at, 
             EXTRACT(DAY FROM NOW() - created_at) as days_open
      FROM bugs
      WHERE status IN ('open', 'in_progress') 
        AND criticality = 'critica'
        AND EXTRACT(DAY FROM NOW() - created_at) > 7
      ORDER BY days_open DESC
      LIMIT 5
    `)

    // Get tests not updated in 30 days
    const staleTests = await query(`
      SELECT id, name, description, updated_at,
             EXTRACT(DAY FROM NOW() - updated_at) as days_stale
      FROM tests
      WHERE EXTRACT(DAY FROM NOW() - updated_at) > 30
      ORDER BY days_stale DESC
      LIMIT 5
    `)

    const alerts = [
      ...criticalBugs.rows.map((bug) => ({
        id: bug.id,
        type: "bug",
        severity: "critical",
        title: `Bug crítico não resolvido há ${bug.days_open} dias`,
        description: bug.name,
        item_id: bug.id,
        days_open: Number.parseInt(bug.days_open),
      })),
      ...staleTests.rows.map((test) => ({
        id: test.id,
        type: "test",
        severity: "warning",
        title: `Teste sem atualização há ${test.days_stale} dias`,
        description: test.name,
        item_id: test.id,
        days_open: Number.parseInt(test.days_stale),
      })),
    ]

    return alerts
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return []
  }
}

export async function getAllTestsForSelect() {
  if (!isDatabaseAvailable()) {
    return mockTests.map((t) => ({ id: t.id, name: t.name }))
  }

  try {
    const result = await query("SELECT id, name FROM tests ORDER BY name")
    return result.rows
  } catch (error) {
    console.error("Error fetching tests for select:", error)
    return []
  }
}

export async function getAllServicesForSelect() {
  if (!isDatabaseAvailable()) {
    return mockServices.map((s) => ({ id: s.id, name: s.name }))
  }

  try {
    const result = await query("SELECT id, name FROM services ORDER BY name")
    return result.rows
  } catch (error) {
    console.error("Error fetching services for select:", error)
    return []
  }
}

export async function getRecentActivities() {
  if (!isDatabaseAvailable()) {
    // Return mock recent activities
    return [
      {
        type: "test",
        title: mockTests[0].name,
        description: mockTests[0].description,
        created_at: mockTests[0].created_at,
      },
      {
        type: "bug",
        title: mockBugs[0].name,
        description: mockBugs[0].description,
        created_at: mockBugs[0].created_at,
      },
      {
        type: "test_case",
        title: mockTestCases[0].name,
        description: mockTestCases[0].description,
        created_at: new Date(),
      },
      {
        type: "test",
        title: mockTests[1].name,
        description: mockTests[1].description,
        created_at: mockTests[1].created_at,
      },
      {
        type: "bug",
        title: mockBugs[1].name,
        description: mockBugs[1].description,
        created_at: mockBugs[1].created_at,
      },
    ]
  }

  try {
    const result = await query(`
      SELECT 'test' as type, name as title, description, created_at
      FROM tests
      UNION ALL
      SELECT 'bug' as type, name as title, description, created_at
      FROM bugs
      UNION ALL
      SELECT 'test_case' as type, name as title, observations as description, created_at
      FROM test_cases
      ORDER BY created_at DESC
      LIMIT 10
    `)
    return result.rows
  } catch (error) {
    console.error("Error fetching recent activities:", error)
    return []
  }
}

export { sql }
