import { Suspense } from "react"
import { ImprovementsHeader } from "@/components/improvements/improvements-header"
import { ImprovementsList } from "@/components/improvements/improvements-list"
import { ImprovementsFilters } from "@/components/improvements/improvements-filters"

export default function ImprovementsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ImprovementsHeader />

      <div className="p-6 space-y-6">
        <ImprovementsFilters />

        <Suspense fallback={<ImprovementsListSkeleton />}>
          <ImprovementsList />
        </Suspense>
      </div>
    </div>
  )
}

function ImprovementsListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
