
"use client"

import { useEffect, useState } from "react"

import { Plus } from "lucide-react"
import { ImprovementFormModal } from "./improvement-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"
import { formatDateForExcel, parseDateFromExcel } from "@/lib/excel-utils"

export function ImprovementsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [services, setServices] = useState([])

  useEffect(() => {
    fetch("/api/services").then(res => res.json()).then(setServices)
  }, [])

  const handleExport = async () => {
    const response = await fetch("/api/improvements")
    const improvements = await response.json()

    const data = improvements.map((improvement: any) => ({
      Nome: improvement.name,
      Descrição: improvement.description,
      Status: improvement.status,
      Prioridade: improvement.priority,
      Impacto: improvement.impact,
      "Link Teste": improvement.test_link || "",
      "User Story": improvement.user_story || "",
      Gherkin: improvement.gherkin || "",
      Evidências: improvement.evidence || "",
      "Data Proposta": formatDateForExcel(improvement.proposed_date),
      "Data Implementada": formatDateForExcel(improvement.implemented_date),
      Observações: improvement.observations || "",
    }))

    return {
      data,
      filename: `melhorias_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Melhorias",
    }
  }

  const handleImport = async (data: any[]) => {
    try {
      const improvements = data.map((row: any) => ({
        name: row["Nome"],
        description: row["Descrição"],
        status: row["Status"],
        priority: row["Prioridade"],
        impact: row["Impacto"],
        test_link: row["Link Teste"],
        user_story: row["User Story"],
        gherkin: row["Gherkin"],
        evidence: row["Evidências"],
        proposed_date: parseDateFromExcel(row["Data Proposta"]),
        implemented_date: parseDateFromExcel(row["Data Implementada"]),
        observations: row["Observações"],
      }))

      const response = await fetch("/api/improvements/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ improvements }),
      })

      if (!response.ok) throw new Error("Erro ao importar")
      window.location.reload()
      return { success: true }
    } catch (error) {
      return { success: false, message: "Erro ao importar melhorias" }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Melhorias</h1>
              <p className="text-muted-foreground mt-1">Gerencie melhorias propostas e implementadas</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nova Melhoria
            </button>
          </div>

          <ExcelActions onExport={handleExport} onImport={handleImport} />
        </div>
      </div>

  <ImprovementFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} services={services} />
    </>
  )
}
