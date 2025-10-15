"use client"

import { Search, Filter, Calendar } from "lucide-react"
import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useSWR from "swr"
import { SearchableSelect } from "@/components/shared/searchable-select"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TestsFilters() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { data: servicesData } = useSWR<{ services: { id: number; name: string }[] }>(
    "/api/services",
    fetcher
  )

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
            placeholder="Buscar testes..."
            defaultValue={searchParams.get("query") || ""}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          defaultValue={searchParams.get("type") || "all"}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os tipos</option>
          <option value="unitario">Unitário</option>
          <option value="funcional">Funcional</option>
          <option value="performance">Performance</option>
          <option value="contrato">Contrato</option>
          <option value="regressao">Regressão</option>
          <option value="exploratorio">Exploratório</option>
        </select>

        <select
          defaultValue={searchParams.get("result") || "all"}
          onChange={(e) => handleFilterChange("result", e.target.value)}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os resultados</option>
          <option value="aprovado">Aprovado</option>
          <option value="falho">Falho</option>
          <option value="quebrado">Quebrado</option>
          <option value="pending">Pendente</option>
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
            <label className="block text-sm font-medium text-foreground mb-2">Tipo de Execução</label>
            <select
              defaultValue={searchParams.get("execution_type") || "all"}
              onChange={(e) => handleFilterChange("execution_type", e.target.value)}
              className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos</option>
              <option value="manual">Manual</option>
              <option value="automatico">Automático</option>
            </select>
          </div>

          <div>
            <SearchableSelect
              label="Serviço"
              options={servicesData?.services || []}
              value={searchParams.get("service") || ""}
              onChange={(value) => handleFilterChange("service", value)}
              placeholder="Filtrar por serviço..."
            />
          </div>
        </div>
      )}
    </div>
  )
}
