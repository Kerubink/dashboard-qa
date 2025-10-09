import * as XLSX from "xlsx"

export interface ExcelExportOptions {
  filename: string
  sheetName: string
  data: any[]
  columns?: { key: string; label: string }[]
}

export interface ExcelImportResult<T> {
  data: T[]
  errors: string[]
}

/**
 * Exporta dados para arquivo Excel
 */
export function exportToExcel({ filename, sheetName, data, columns }: ExcelExportOptions) {
  try {
    // Se colunas específicas foram fornecidas, mapeia os dados
    const exportData = columns
      ? data.map((item) => {
          const row: any = {}
          columns.forEach((col) => {
            row[col.label] = item[col.key]
          })
          return row
        })
      : data

    // Cria workbook e worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Ajusta largura das colunas automaticamente
    const maxWidth = 50
    const colWidths = Object.keys(exportData[0] || {}).map((key) => {
      const maxLength = Math.max(key.length, ...exportData.map((row) => String(row[key] || "").length))
      return { wch: Math.min(maxLength + 2, maxWidth) }
    })
    ws["!cols"] = colWidths

    // Gera e baixa o arquivo
    XLSX.writeFile(wb, `${filename}.xlsx`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error)
    return { success: false, error: "Erro ao exportar dados" }
  }
}

/**
 * Importa dados de arquivo Excel
 */
export function importFromExcel<T>(
  file: File,
  validator?: (data: any[]) => ExcelImportResult<T>,
): Promise<ExcelImportResult<T>> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })

        // Pega a primeira planilha
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Converte para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Valida os dados se um validador foi fornecido
        if (validator) {
          const result = validator(jsonData)
          resolve(result)
        } else {
          resolve({ data: jsonData as T[], errors: [] })
        }
      } catch (error) {
        console.error("Erro ao importar Excel:", error)
        resolve({
          data: [],
          errors: ["Erro ao processar arquivo Excel. Verifique o formato."],
        })
      }
    }

    reader.onerror = () => {
      resolve({
        data: [],
        errors: ["Erro ao ler arquivo. Tente novamente."],
      })
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * Formata data para Excel (formato brasileiro)
 */
export function formatDateForExcel(date: Date | string | null): string {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR")
}

/**
 * Parse data do Excel (formato brasileiro)
 */
export function parseDateFromExcel(dateStr: string): Date | null {
  if (!dateStr) return null

  // Tenta formato brasileiro DD/MM/YYYY
  const parts = dateStr.split("/")
  if (parts.length === 3) {
    const [day, month, year] = parts
    return new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
  }

  // Tenta formato ISO
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}
