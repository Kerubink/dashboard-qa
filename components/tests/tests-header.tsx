"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { TestFormModal } from "./test-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"
import { formatDateForExcel, parseDateFromExcel } from "@/lib/excel-utils"

export function TestsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExport = async () => {
    // Busca todos os testes
    const response = await fetch("/api/tests")
    const tests = await response.json()

    // Formata dados para Excel
    const data = tests.map((test: any) => ({
      Nome: test.name,
      Descrição: test.description,
      Tipo: test.type,
      Resultado: test.result,
      Execução: test.execution_type,
      Responsável: test.responsible,
      Serviço: test.service,
      Data: formatDateForExcel(test.test_date),
      "Link Jira": test.jira_link || "",
      "Link Bug": test.bug_link || "",
      "Massa de Dados": test.test_data || "",
      Ambiente: test.environment || "",
      Evidências: test.evidence || "",
      Observações: test.observations || "",
    }))

    return {
      data,
      filename: `testes_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Testes",
    }
  }

  const handleImport = async (data: any[]) => {
    try {
      // Converte dados do Excel para formato da API
      const tests = data.map((row: any) => ({
        name: row["Nome"],
        description: row["Descrição"],
        type: row["Tipo"],
        result: row["Resultado"],
        execution_type: row["Execução"],
        responsible: row["Responsável"],
        service: row["Serviço"],
        test_date: parseDateFromExcel(row["Data"]),
        jira_link: row["Link Jira"],
        bug_link: row["Link Bug"],
        test_data: row["Massa de Dados"],
        environment: row["Ambiente"],
        evidence: row["Evidências"],
        observations: row["Observações"],
      }))

      // Envia para API
      const response = await fetch("/api/tests/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tests }),
      })

      if (!response.ok) throw new Error("Erro ao importar")

      // Recarrega a página para mostrar novos dados
      window.location.reload()

      return { success: true }
    } catch (error) {
      return { success: false, message: "Erro ao importar testes" }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Testes</h1>
              <p className="text-muted-foreground mt-1">Gerencie todos os testes executados</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Novo Teste
            </button>
          </div>

          <ExcelActions onExport={handleExport} onImport={handleImport} />
        </div>
      </div>

      <TestFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
