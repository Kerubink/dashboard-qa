import { Suspense } from "react"
import { BugsHeader } from "@/components/bugs/bugs-header"
import { BugsList } from "@/components/bugs/bugs-list"
import { BugsFilters } from "@/components/bugs/bugs-filters"
import { BugsStats } from "@/components/bugs/bugs-stats"

export const dynamic = 'force-dynamic'

export default function BugsPage() {
  return (
    <div className="min-h-screen bg-background">
      <BugsHeader />

      <div className="p-6 space-y-6">
        <Suspense fallback={<div className="h-24 bg-card rounded-lg animate-pulse" />}>
          <BugsStats />
        </Suspense>

        <BugsFilters />

        <Suspense fallback={<BugsListSkeleton />}>
          <BugsList />
        </Suspense>
      </div>
    </div>
  )
}

function BugsListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
