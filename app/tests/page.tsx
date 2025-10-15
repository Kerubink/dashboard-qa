import { Suspense } from "react"
import { TestsHeader } from "@/components/tests/tests-header"
import { TestsList } from "@/components/tests/tests-list"
import { TestsFilters } from "@/components/tests/tests-filters"

export const dynamic = 'force-dynamic'

export default function TestsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = Number(searchParams?.page) || 1
  const filters = {
    query: searchParams?.query?.toString(),
    type: searchParams?.type?.toString(),
    result: searchParams?.result?.toString(),
    execution_type: searchParams?.execution_type?.toString(),
    startDate: searchParams?.startDate?.toString(),
    endDate: searchParams?.endDate?.toString(),
    service: searchParams?.service?.toString(),
  }

  return (
    <div className="min-h-screen bg-background">
      <TestsHeader />

      <div className="p-6 space-y-6">
        <TestsFilters />
        <Suspense fallback={<TestsListSkeleton />}>
          <TestsList currentPage={currentPage} filters={filters} />
        </Suspense>
      </div>
    </div>
  )
}

function TestsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
