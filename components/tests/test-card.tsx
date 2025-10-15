"use client"

import { useState } from "react"
import { lightFormat } from "date-fns"
import type { Test } from "@/lib/types"
import { TestFormModal } from "./test-form-modal"
 import { MoreVertical, User, Computer, Calendar, Tag } from "lucide-react"

const RESULT_COLORS: Record<string, string> = {
  aprovado: "bg-success/20 text-success border-success/30",
  reprovado: "bg-destructive/20 text-destructive border-destructive/30",
  bloqueado: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  pendente: "bg-muted text-muted-foreground border-border",
}

const RESULT_LABELS: Record<string, string> = {
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  bloqueado: "Bloqueado",
  pendente: "Pendente",
}

const EXECUTION_TYPE_LABELS: Record<string, string> = {
  manual: "Manual",
  automatico: "Automático",
}

const EXECUTION_TYPE_ICONS: Record<string, React.ElementType> = {
  manual: User,
  automatico: Computer,
}

const TEST_TYPE_LABELS: Record<string, string> = {
  funcional: "Funcional",
  exploratório: "Exploratório",
  integracao: "Integração",
  regressao: "Regressão",
  unidade: "Unidade",
  e2e: "E2E",
}

interface TestCardProps {
  test: Test
}

export function TestCard({ test }: TestCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // Para renderizar um componente dinamicamente, ele precisa ser atribuído a uma variável com a primeira letra maiúscula.
  const Icon = test.execution_type ? EXECUTION_TYPE_ICONS[test.execution_type] : null

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1" title={test.name}>{test.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-md border ${RESULT_COLORS[test.result] || RESULT_COLORS.pendente}`}>
                  {RESULT_LABELS[test.result] || test.result}
                </span>
                {test.execution_type && (
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary border border-border flex items-center gap-1.5">
                    {Icon && <Icon className="w-3 h-3" />}
                    {EXECUTION_TYPE_LABELS[test.execution_type] || test.execution_type}
                  </span>
                )}
                {test.type && (
                  <span className="text-xs px-2 py-1 rounded-md bg-secondary border border-border flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    {TEST_TYPE_LABELS[test.type] || test.type}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setIsEditModalOpen(true)} className="p-1 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          {test.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-3">{test.description}</p>}
        </div>
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-end text-xs text-muted-foreground gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>{test.created_at ? lightFormat(new Date(test.created_at), "dd/MM/yyyy") : "Data indisponível"}</span>
        </div>
      </div>

      <TestFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} test={test} />
    </>
  )
}