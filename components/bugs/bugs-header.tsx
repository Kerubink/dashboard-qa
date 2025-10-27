
"use client"

import { useState } from "react"

import { Plus } from "lucide-react"
import { BugFormModal } from "./bug-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"
import { formatDateForExcel, parseDateFromExcel } from "@/lib/excel-utils"

export function BugsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExport = async () => {
    const response = await fetch("/api/bugs/export");
    const bugs = await response.json();

    const data = bugs.map((bug: any) => ({
      Nome: bug.name,
      Descrição: bug.description,
      Status: bug.status,
      Prioridade: bug.priority,
      Severidade: bug.severity,
      "Link Teste": bug.test_link || "",
      "User Story": bug.user_story || "",
      Gherkin: bug.gherkin || "",
      Evidências: bug.evidence || "",
      "Data Encontrado": formatDateForExcel(bug.found_date),
      "Data Resolvido": formatDateForExcel(bug.resolved_date),
      Observações: bug.observations || "",
    }))

    return {
      data,
      filename: `bugs_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Bugs",
    }
  }

  const handleImport = async (data: any[]) => {
    try {
      const bugs = data.map((row: any) => ({
        name: row["Nome"],
        description: row["Descrição"],
        status: row["Status"],
        priority: row["Prioridade"],
        severity: row["Severidade"],
        test_link: row["Link Teste"],
        user_story: row["User Story"],
        gherkin: row["Gherkin"],
        evidence: row["Evidências"],
        found_date: parseDateFromExcel(row["Data Encontrado"]),
        resolved_date: parseDateFromExcel(row["Data Resolvido"]),
        observations: row["Observações"],
      }))

      const response = await fetch("/api/bugs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bugs }),
      })

      if (!response.ok) throw new Error("Erro ao importar")
      window.location.reload()
      return { success: true }
    } catch (error) {
      return { success: false, message: "Erro ao importar bugs" }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Bugs</h1>
              <p className="text-muted-foreground mt-1">Gerencie bugs encontrados e seu status</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Novo Bug
            </button>
          </div>

          <ExcelActions onExport={handleExport} onImport={handleImport} />
        </div>
      </div>

  <BugFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
