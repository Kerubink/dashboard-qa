import { NextResponse } from "next/server"
import {
  getDashboardStats,
  getTestsByType,
  getTestsByResult,
  getCoverageByService,
  getFunnelData,
  getRecentActivities,
  getAlerts,
} from "@/lib/db"

export async function GET() {
  try {
    const [
      stats,
      testsByType,
      testsByResult,
      coverageByService,
      funnelData,
      recentActivities,
      alerts,
    ] = await Promise.all([
      getDashboardStats(),
      getTestsByType(),
      getTestsByResult(),
      getCoverageByService(),
      getFunnelData(),
      getRecentActivities(),
      getAlerts(),
    ])

    return NextResponse.json({ stats, testsByType, testsByResult, coverageByService, funnelData, recentActivities, alerts })
  } catch (error) {
    console.error("Erro no endpoint /api/dashboard:", error)
    return NextResponse.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 })
  }
}
