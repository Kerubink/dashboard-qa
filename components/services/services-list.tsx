import { query } from "@/lib/db"
import { ServiceCard } from "./service-card"

export async function ServicesList() {
  const services = await getServicesWithMetrics()

  if (services.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhum serviço encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">Clique em "Novo Serviço" para adicionar o primeiro serviço</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

async function getServicesWithMetrics() {
  try {
    const result = await query(`
      SELECT 
        s.*,
        COUNT(DISTINCT t.id) FILTER (WHERE t.id IS NOT NULL) as total_tests,
        COUNT(DISTINCT t.id) FILTER (WHERE t.result = 'aprovado') as passed_tests,
        COUNT(DISTINCT b.id) as total_bugs,
        COUNT(DISTINCT CASE WHEN b.status = 'open' THEN b.id END) as open_bugs,
        COUNT(DISTINCT tc.id) as total_test_cases,
        COUNT(DISTINCT t.test_case_id) as executed_test_cases
      FROM services s
      LEFT JOIN test_cases tc ON tc.service_id = s.id
      LEFT JOIN tests t ON t.test_case_id = tc.id
      LEFT JOIN bugs b ON b.service_id = s.id
      GROUP BY s.id
      ORDER BY s.name
    `)
    return result.rows
  } catch (error) {
    console.error("Error fetching services with metrics:", error)
    return []
  }
}
