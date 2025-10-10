
"use client"

import { useEffect, useState } from "react"

import { Plus } from "lucide-react"
import { TestCaseFormModal } from "./test-case-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"
import { formatDateForExcel } from "@/lib/excel-utils"

export function TestCasesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [services, setServices] = useState([])

  useEffect(() => {
    fetch("/api/services").then(res => res.json()).then(setServices)
  }, [])

  const handleExport = async () => {
    const response = await fetch("/api/test-cases")
    const testCases = await response.json()

    const data = testCases.map((tc: any) => ({
      Nome: tc.name,
      Descrição: tc.description,
      Serviço: tc.service,
      "User Story": tc.user_story || "",
      Gherkin: tc.gherkin || "",
      "Massa de Dados": tc.test_data || "",
      Status: tc.status,
      "Automação IA": tc.is_automated ? "Sim" : "Não",
      "Data Criação": formatDateForExcel(tc.created_date),
      Observações: tc.observations || "",
    }))

    return {
      data,
      filename: `casos_teste_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Casos de Teste",
    }
  }

  const handleImport = async (data: any[]) => {
    try {
      const testCases = data.map((row: any) => ({
        name: row["Nome"],
        description: row["Descrição"],
        service: row["Serviço"],
        user_story: row["User Story"],
        gherkin: row["Gherkin"],
        test_data: row["Massa de Dados"],
        status: row["Status"],
        is_automated: row["Automação IA"] === "Sim",
        observations: row["Observações"],
      }))

      const response = await fetch("/api/test-cases/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCases }),
      })

      if (!response.ok) throw new Error("Erro ao importar")
      window.location.reload()
      return { success: true }
    } catch (error) {
      return { success: false, message: "Erro ao importar casos de teste" }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Casos de Teste</h1>
              <p className="text-muted-foreground mt-1">Gerencie casos de teste e cenários</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Novo Caso de Teste
            </button>
          </div>

          <ExcelActions onExport={handleExport} onImport={handleImport} />
        </div>
      </div>

  <TestCaseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} services={services} />
    </>
  )
}
