"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, ExternalLink, MoreVertical } from "lucide-react"
import type { Improvement } from "@/lib/types"
import { useState } from "react"
import { ImprovementFormModal } from "./improvement-form-modal"

const STATUS_COLORS: Record<string, string> = {
  proposed: "bg-muted text-muted-foreground border-border",
  approved: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  in_progress: "bg-warning/20 text-warning border-warning/30",
  completed: "bg-success/20 text-success border-success/30",
  rejected: "bg-chart-5/20 text-chart-5 border-chart-5/30",
}

const STATUS_LABELS: Record<string, string> = {
  proposed: "Proposta",
  approved: "Aprovada",
  in_progress: "Em Progresso",
  completed: "Concluída",
  rejected: "Rejeitada",
}

interface ImprovementCardProps {
  improvement: Improvement
}

export function ImprovementCard({ improvement }: ImprovementCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">{improvement.name}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap ${STATUS_COLORS[improvement.status]}`}
              >
                {STATUS_LABELS[improvement.status] || improvement.status}
              </span>
            </div>

            {improvement.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{improvement.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Criada{" "}
                  {formatDistanceToNow(new Date(improvement.start_date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              {improvement.end_date && (
                <div className="flex items-center gap-2 text-success">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Concluída{" "}
                    {formatDistanceToNow(new Date(improvement.end_date), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
            </div>

            {improvement.user_story && (
              <div className="mt-4 p-3 bg-secondary rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">User Story</p>
                <p className="text-sm text-foreground line-clamp-2">{improvement.user_story}</p>
              </div>
            )}

            {improvement.evidence && (
              <div className="mt-3">
                <a
                  href={improvement.evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver Evidências
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <ImprovementFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        improvement={improvement}
      />
    </>
  )
}
