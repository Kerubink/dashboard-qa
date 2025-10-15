import { Suspense } from "react"
import { PerformanceHeader } from "@/components/performance/performance-header"
import { PerformancePlansList } from "@/components/performance/performance-plans-list"
import { PerformanceFilters } from "@/components/performance/performance-filters"

export const dynamic = 'force-dynamic'

export default function PerformancePage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = Number(searchParams?.page) || 1
  const filters = {
    query: searchParams?.query?.toString(),
    status: searchParams?.status?.toString(),
    service: searchParams?.service?.toString(),
  }

  return (
    <div className="min-h-screen bg-background">
      <PerformanceHeader />

      <div className="p-6 space-y-6">
        <PerformanceFilters />
        <Suspense fallback={<PerformancePlansListSkeleton />}>
          <PerformancePlansList currentPage={currentPage} filters={filters} />
        </Suspense>
      </div>
    </div>
  )
}

function PerformancePlansListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-40 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
