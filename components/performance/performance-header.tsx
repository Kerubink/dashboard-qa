"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { PerformancePlanFormModal } from "./performance-plan-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"
import { formatDateForExcel, parseDateFromExcel } from "@/lib/excel-utils"

export function PerformanceHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExport = async () => {
    const response = await fetch("/api/performance/export")
    const plans = await response.json()

    const data = plans.map((plan: any) => ({
      Nome: plan.name,
      Descrição: plan.description,
      "Serviço": plan.service,
      "Tipo de Teste": plan.type,
      Status: plan.status,
      "Métricas Alvo": plan.target_metrics,
      "Massa de Dados": plan.test_data,
      "Data Execução": formatDateForExcel(plan.execution_date),
      Resultados: plan.results,
      Observações: plan.observations || "",
    }))

    return {
      data,
      filename: `performance_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Performance",
    }
  }

  const handleImport = async (data: any[]) => {
    try {
      const plans = data.map((row: any) => ({
        name: row["Nome"],
        description: row["Descrição"],
        service_name: row["Serviço"],
        test_type: row["Tipo de Teste"],
        status: row["Status"],
        target_metrics: row["Métricas Alvo"],
        test_data: row["Massa de Dados"],
        execution_date: parseDateFromExcel(row["Data Execução"]),
        results: row["Resultados"],
        observations: row["Observações"],
      }))

      const response = await fetch("/api/performance/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans }),
      })

      if (!response.ok) throw new Error("Erro ao importar")
      window.location.reload()
      return { success: true }
    } catch (error) {
      return { success: false, message: "Erro ao importar planos de performance" }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Testes de Performance</h1>
              <p className="text-muted-foreground mt-1">Gerencie planos e resultados de testes de performance</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Novo Plano
            </button>
          </div>

          <ExcelActions onExport={handleExport} onImport={handleImport} />
        </div>
      </div>

  <PerformancePlanFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
