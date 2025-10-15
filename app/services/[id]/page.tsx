import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import type { Service } from "@/lib/types"
import { Suspense } from "react"
import { ServiceMetrics } from "@/components/services/service-metrics"
import { ServiceRelatedItems } from "@/components/services/service-related-items"
import { ServiceDetailsHeader } from "@/components/services/service-details-header"
import { ServiceTestCasesList } from "@/components/services/service-test-cases-list"
import { ServiceTestsList } from "@/components/services/service-tests-list"

async function getService(id: string): Promise<Service | null> {
  try {
    const result = await query("SELECT * FROM services WHERE id = $1", [id])
    if (result.rowCount === 0) return null
    return result.rows[0]
  } catch (error) {
    console.error("Failed to fetch service:", error)
    return null
  }
}

interface ServiceDetailsPageProps {
  params: { id: string }
  searchParams: { tab?: string }
}

export default async function ServiceDetailsPage({ params, searchParams }: ServiceDetailsPageProps) {
  const service = await getService(params.id)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ServiceDetailsHeader service={service} />
      <main className="flex-1 p-6 space-y-6">
        <ServiceMetrics serviceId={params.id} />
        <ServiceRelatedItems>
          <Suspense fallback={<div className="h-64 animate-pulse bg-secondary rounded-lg" />}>
            {(!searchParams.tab || searchParams.tab === "test-cases") && (
              <ServiceTestCasesList serviceId={params.id} />
            )}
            {searchParams.tab === "tests" && <ServiceTestsList serviceId={params.id} />}
          </Suspense>
        </ServiceRelatedItems>
      </main>
    </div>
  )
}