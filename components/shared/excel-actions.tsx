"use client"

import type React from "react"

import { Download, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { exportToExcel, importFromExcel, type ExcelImportResult } from "@/lib/excel-utils"

interface ExcelActionsProps {
  onExport: () => Promise<{ data: any[]; filename: string; sheetName: string }>
  onImport: (data: any[]) => Promise<{ success: boolean; message?: string }>
  validateImport?: (data: any[]) => ExcelImportResult<any>
}

export function ExcelActions({ onExport, onImport, validateImport }: ExcelActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
      const { data, filename, sheetName } = await onExport()
      const result = exportToExcel({ data, filename, sheetName })

      if (result.success) {
        setMessage({ type: "success", text: "Dados exportados com sucesso!" })
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao exportar" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao exportar dados" })
    } finally {
      setIsExporting(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setMessage(null)

    try {
      const result = await importFromExcel(file, validateImport)

      if (result.errors.length > 0) {
        setMessage({ type: "error", text: result.errors.join(", ") })
        setIsImporting(false)
        setTimeout(() => setMessage(null), 5000)
        return
      }

      const importResult = await onImport(result.data)

      if (importResult.success) {
        setMessage({
          type: "success",
          text: importResult.message || `${result.data.length} registros importados com sucesso!`,
        })
      } else {
        setMessage({ type: "error", text: importResult.message || "Erro ao importar dados" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao processar arquivo" })
    } finally {
      setIsImporting(false)
      setTimeout(() => setMessage(null), 3000)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {isExporting ? "Exportando..." : "Exportar Excel"}
      </button>

      <button
        onClick={handleImportClick}
        disabled={isImporting}
        className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="w-4 h-4" />
        {isImporting ? "Importando..." : "Importar Excel"}
      </button>

      {message && (
        <div
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
