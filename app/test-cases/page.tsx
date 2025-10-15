import { Suspense } from "react"
import { TestCasesHeader } from "@/components/test-cases/test-cases-header"
import { TestCasesList } from "@/components/test-cases/test-cases-list"
import { TestCasesFilters } from "@/components/test-cases/test-cases-filters"

export const dynamic = 'force-dynamic'

export default function TestCasesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = Number(searchParams?.page) || 1
  const filters = {
    query: searchParams?.query?.toString(),
    status: searchParams?.status?.toString(),
    service: searchParams?.service?.toString(),
  }

  return (
    <div className="min-h-screen bg-background">
      <TestCasesHeader />

      <div className="p-6 space-y-6">
        <TestCasesFilters />
        <Suspense fallback={<TestCasesListSkeleton />}>
          <TestCasesList currentPage={currentPage} filters={filters} />
        </Suspense>
      </div>
    </div>
  )
}

function TestCasesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
