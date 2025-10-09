"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, User, ExternalLink, BugIcon, MoreVertical } from "lucide-react"
import type { Test } from "@/lib/types"
import { useState } from "react"
import { TestFormModal } from "./test-form-modal"

const TYPE_LABELS: Record<string, string> = {
  unitario: "Unitário",
  funcional: "Funcional",
  performance: "Performance",
  contrato: "Contrato",
  regressao: "Regressão",
  exploratorio: "Exploratório",
}

const RESULT_COLORS: Record<string, string> = {
  aprovado: "bg-success/20 text-success border-success/30",
  falho: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  quebrado: "bg-warning/20 text-warning border-warning/30",
  pending: "bg-muted text-muted-foreground border-border",
}

const RESULT_LABELS: Record<string, string> = {
  aprovado: "Aprovado",
  falho: "Falho",
  quebrado: "Quebrado",
  pending: "Pendente",
}

interface TestCardProps {
  test: Test
}

export function TestCard({ test }: TestCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">{test.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground border border-border">
                {TYPE_LABELS[test.type] || test.type}
              </span>
              <span className={`text-xs px-2 py-1 rounded-md border ${RESULT_COLORS[test.result]}`}>
                {RESULT_LABELS[test.result] || test.result}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {test.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{test.description}</p>}

        <div className="space-y-2 mb-4">
          {test.responsible_qa && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate">{test.responsible_qa}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(test.execution_date), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>

          {test.execution_type && (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-md ${
                  test.execution_type === "automatico"
                    ? "bg-chart-1/20 text-chart-1 border border-chart-1/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {test.execution_type === "automatico" ? "Automático" : "Manual"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          {test.jira_link && (
            <a
              href={test.jira_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Jira
            </a>
          )}

          {test.bug_link && (
            <a
              href={test.bug_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-chart-5 hover:underline"
            >
              <BugIcon className="w-3 h-3" />
              Bug
            </a>
          )}
        </div>
      </div>

      <TestFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} test={test} />
    </>
  )
}
