"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, MoreVertical, Gauge } from "lucide-react"
import type { PerformancePlan } from "@/lib/types"
import { useState } from "react"
import { PerformancePlanFormModal } from "./performance-plan-form-modal"

const STATUS_COLORS: Record<string, string> = {
  planned: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-warning/20 text-warning border-warning/30",
  completed: "bg-success/20 text-success border-success/30",
  failed: "bg-chart-5/20 text-chart-5 border-chart-5/30",
}

const STATUS_LABELS: Record<string, string> = {
  planned: "Planejado",
  in_progress: "Em Progresso",
  completed: "Concluído",
  failed: "Falhou",
}

interface PerformancePlanCardProps {
  plan: PerformancePlan
}

export function PerformancePlanCard({ plan }: PerformancePlanCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary text-chart-2">
                <Gauge className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground line-clamp-1">{plan.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-md border inline-block mt-1 ${STATUS_COLORS[plan.status]}`}>
                  {STATUS_LABELS[plan.status] || plan.status}
                </span>
              </div>
            </div>

            {plan.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {plan.test_type && (
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Tipo de Teste</p>
                  <p className="text-sm text-foreground">{plan.test_type}</p>
                </div>
              )}

              {plan.target_metrics && (
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Métricas Alvo</p>
                  <p className="text-sm text-foreground line-clamp-2">{plan.target_metrics}</p>
                </div>
              )}
            </div>

            {plan.results && (
              <div className="mb-4 p-3 bg-secondary rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">Resultados</p>
                <p className="text-sm text-foreground line-clamp-3">{plan.results}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Criado{" "}
                  {formatDistanceToNow(new Date(plan.start_date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              {plan.execution_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Executado{" "}
                    {formatDistanceToNow(new Date(plan.execution_date), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <PerformancePlanFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} plan={plan} />
    </>
  )
}
