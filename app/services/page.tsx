import { Suspense } from "react"
import { ServicesHeader } from "@/components/services/services-header"
import { ServicesList } from "@/components/services/services-list"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ServicesHeader />

      <div className="p-6">
        <Suspense fallback={<ServicesListSkeleton />}>
          <ServicesList />
        </Suspense>
      </div>
    </div>
  )
}

function ServicesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
