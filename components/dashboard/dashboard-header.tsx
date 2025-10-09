"use client"

import { Filter } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const [dateRange, setDateRange] = useState("last-30-days")

  return (
    <div className="border-b border-border bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Visão geral das métricas de qualidade</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="today">Hoje</option>
              <option value="last-7-days">Últimos 7 dias</option>
              <option value="last-30-days">Últimos 30 dias</option>
              <option value="last-90-days">Últimos 90 dias</option>
              <option value="all-time">Todo período</option>
            </select>

            <button className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
