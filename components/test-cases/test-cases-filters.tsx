"use client"

import { Search, Filter } from "lucide-react"
import { useState } from "react"

export function TestCasesFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar casos de teste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="done">Feito</option>
          <option value="blocked">Bloqueado</option>
        </select>

        <button className="px-4 py-2 bg-secondary text-foreground rounded-lg border border-border hover:bg-accent transition-colors flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Mais Filtros
        </button>
      </div>
    </div>
  )
}
