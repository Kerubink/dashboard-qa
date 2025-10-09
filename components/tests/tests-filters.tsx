"use client"

import { Search, Filter, Calendar } from "lucide-react"
import { useState } from "react"

export function TestsFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar testes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
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
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Inicial</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tipo de Execução</label>
            <select className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="all">Todos</option>
              <option value="manual">Manual</option>
              <option value="automatico">Automático</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
