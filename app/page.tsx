import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AlertsSection } from "@/components/dashboard/alerts-section"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        <Suspense fallback={<MetricsGridSkeleton />}>
          <MetricsGrid />
        </Suspense>

        <Suspense fallback={<div className="h-48 bg-card rounded-lg animate-pulse" />}>
          <AlertsSection />
        </Suspense>

        <Suspense fallback={<ChartsSectionSkeleton />}>
          <ChartsSection />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-card rounded-lg animate-pulse" />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  )
}

function MetricsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}

function ChartsSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-80 bg-card rounded-lg animate-pulse" />
      ))}
    </div>
  )
}
