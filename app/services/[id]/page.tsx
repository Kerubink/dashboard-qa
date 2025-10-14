import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import type { Service } from "@/lib/types"
import { ServiceMetrics } from "@/components/services/service-metrics"
import { ServiceDetailsHeader } from "@/components/services/service-details-header"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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

export default async function ServiceDetailsPage({ params }: { params: { id: string } }) {
  const service = await getService(params.id)

  if (!service) {
    notFound()
  }

  return (
    <div className="flex flex-col h-full">
      <ServiceDetailsHeader service={service} />
      <main className="flex-1 p-6 space-y-6"><ServiceMetrics serviceId={params.id} /></main>
    </div>
  )
}