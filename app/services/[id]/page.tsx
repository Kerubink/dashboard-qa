import { query } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Server } from "lucide-react"
import { ServiceMetrics } from "@/components/services/service-metrics"

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Serviços
          </Link>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-secondary text-primary">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{service.name}</h1>
              {service.description && <p className="text-muted-foreground mt-2">{service.description}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ServiceMetrics serviceId={id} />
      </div>
    </div>
  )
}

async function getServiceById(id: string) {
  try {
    const result = await query("SELECT * FROM services WHERE id = $1", [id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching service:", error)
    return null
  }
}
