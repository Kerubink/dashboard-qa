
"use client"

import { useState } from "react"

import { Plus } from "lucide-react"
import { TestFormModal } from "./test-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"
import { formatDateForExcel, parseDateFromExcel } from "@/lib/excel-utils"

export function TestsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExport = async () => {
    // Busca todos os testes
    const response = await fetch("/api/tests/export");
    const tests = await response.json();

    // Formata dados para Excel
    const data = tests.map((test: any) => ({
      "Nome": test.name,
      "Descrição": test.description,
      "Serviço": test.service_name,
      "Caso de Teste": test.test_case_name,
      "Tipo": test.type,
      "Resultado": test.result,
      "Tipo de Execução": test.execution_type,
      "Local de Execução": test.execution_location,
      "Método de Execução": test.execution_method,
      "QA Responsável": test.responsible_qa,
      "Dev Responsável": test.responsible_dev,
      "Data de Execução": formatDateForExcel(test.execution_date),
      "Link Jira": test.jira_link || "",
      "Link Bug": test.bug_link || "",
      "Massa de Dados": test.test_data || "",
      "Evidências": test.evidence || "",
    }));

    return {
      data,
      filename: `testes_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Testes",
    };
  }

  const handleImport = async (data: any[]) => {
    try {
      // Converte dados do Excel para formato da API
      const tests = data.map((row: any) => ({
        name: row["Nome"] || "",
        description: row["Descrição"] || "",
        service_name: row["Serviço"],
        test_case_name: row["Caso de Teste"],
        type: row["Tipo"] || "funcional",
        result: row["Resultado"] || "pendente",
        execution_type: row["Tipo de Execução"] || "manual",
        execution_location: row["Local de Execução"] || "",
        execution_method: row["Método de Execução"] || "",
        responsible_qa: row["QA Responsável"] || "",
        responsible_dev: row["Dev Responsável"] || "",
        execution_date: parseDateFromExcel(row["Data de Execução"]),
        jira_link: row["Link Jira"] || "",
        bug_link: row["Link Bug"] || "",
        test_data: row["Massa de Dados"] || "",
        evidence: row["Evidências"] || "",
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
              <p className="text-muted-foreground mt-1">Gerencie testes e execuções</p>
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
