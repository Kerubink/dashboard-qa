// app/dashboard/page.tsx
import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsGrid } from "@/components/dashboard/metrics-grid"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AlertsSection } from "@/components/dashboard/alerts-section"
import {
  getDashboardStats,
  getTestsByType,
  getTestsByResult,
  getTestsStatusByService,
  getFunnelData,
  getRecentActivities,
  getAlerts,
} from "@/lib/db"

// ADICIONADO: Forçar renderização dinâmica (igual à página de serviços)
export const dynamic = 'force-dynamic'

// FUNÇÃO SIMPLES - EXATAMENTE COMO NA PÁGINA DE SERVIÇOS
async function getDashboardData() {
  try {
    const [
      stats,
      testsByType,
      testsByResult,
      { data: coverageByServiceData, services: coverageByServiceServices },
      funnelData,
      recentActivities,
      alerts,
    ] = await Promise.all([
      getDashboardStats(),
      getTestsByType(),
      getTestsByResult(),
      getTestsStatusByService(),
      getFunnelData(),
      getRecentActivities(),
      getAlerts(),
    ]);

    return { 
      stats, 
      testsByType, 
      testsByResult, 
      coverageByService: {
        data: coverageByServiceData,
        services: coverageByServiceServices,
      },
      funnelData, 
      recentActivities, 
      alerts 
    };
  } catch (error) {
    // Log para facilitar investigação sem retornar dados mockados
    console.error("Erro ao buscar dados do dashboard (server):", error);
    throw error;
  }
}

export default async function DashboardPage() {
  // CHAMADA DIRETA - EXATAMENTE COMO NA PÁGINA DE SERVIÇOS
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="p-6 space-y-6">
        <Suspense fallback={<MetricsGridSkeleton />}>
          <MetricsGrid metrics={data.stats} />
        </Suspense>

        <Suspense fallback={<div className="h-48 bg-card rounded-lg animate-pulse" />}>
          <AlertsSection alerts={data.alerts} />
        </Suspense>

        <Suspense fallback={<ChartsSectionSkeleton />}>
          <ChartsSection
            testsByType={data.testsByType}
            testsByResult={data.testsByResult}
            coverageByService={data.coverageByService}
            funnelData={data.funnelData}
          />
        </Suspense>

        <Suspense fallback={<div className="h-64 bg-card rounded-lg animate-pulse" />}>
          <RecentActivity activities={data.recentActivities} />
        </Suspense>
      </div>
    </div>
  )
}

function MetricsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
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