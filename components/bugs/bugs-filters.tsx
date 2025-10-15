"use client"

import { Search, Filter, Calendar } from "lucide-react"
import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function BugsFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showAdvanced, setShowAdvanced] = useState(false)

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to first page
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar bugs..."
            defaultValue={searchParams.get("query") || ""}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          defaultValue={searchParams.get("status") || "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os status</option>
          <option value="open">Aberto</option>
          <option value="in_progress">Em Progresso</option>
          <option value="resolved">Resolvido</option>
          <option value="closed">Fechado</option>
        </select>

        <select
          defaultValue={searchParams.get("criticality") || "all"}
          onChange={(e) => handleFilterChange("criticality", e.target.value)}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todas criticidades</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Mais Filtros
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Risco</label>
            <select
              defaultValue={searchParams.get("risk") || "all"}
              onChange={(e) => handleFilterChange("risk", e.target.value)}
              className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos os riscos</option>
              <option value="critico">Crítico</option>
              <option value="alto">Alto</option>
              <option value="medio">Médio</option>
              <option value="baixo">Baixo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Inicial</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                defaultValue={searchParams.get("startDate") || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Final</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                defaultValue={searchParams.get("endDate") || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Responsável</label>
            <input
              type="text"
              placeholder="Nome do QA/Dev"
              defaultValue={searchParams.get("responsible") || ""}
              onChange={(e) => handleFilterChange("responsible", e.target.value)}
              className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  )
}
