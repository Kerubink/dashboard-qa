"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ServiceFormModal } from "./service-form-modal"
import { ExcelActions } from "@/components/shared/excel-actions"

export function ServicesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleCloseModal = () => {
    setIsModalOpen(false)
    router.refresh()
  }

  const handleExport = async () => {
    const response = await fetch("/api/services/export")
    const services = await response.json()

    const data = services.map((service: any) => ({
      Nome: service.name,
      Descrição: service.description,
      Responsável: service.owner,
      Repositório: service.repository || "",
      Documentação: service.documentation || "",
      Status: service.status,
      "Cobertura (%)": service.coverage_percentage || "",
      Observações: service.observations || "",
    }))

    return {
      data,
      filename: `servicos_${new Date().toISOString().split("T")[0]}`,
      sheetName: "Serviços",
    }
  }

  const handleImport = async (data: any[]) => {
    try {
      const services = data.map((row: any) => ({
        name: row["Nome"],
        description: row["Descrição"],
        owner: row["Responsável"],
        repository: row["Repositório"],
        documentation: row["Documentação"],
        status: row["Status"],
        coverage_percentage: row["Cobertura (%)"],
        observations: row["Observações"],
      }))

      const response = await fetch("/api/services/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services }),
      })

      if (!response.ok) throw new Error("Erro ao importar")
      window.location.reload()
      return { success: true }
    } catch (error) {
      return { success: false, message: "Erro ao importar serviços" }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
              <p className="text-muted-foreground mt-1">Gerencie serviços e visualize KPIs individuais</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Novo Serviço
            </button>
          </div>

          <ExcelActions onExport={handleExport} onImport={handleImport} />
        </div>
      </div>

      <ServiceFormModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
