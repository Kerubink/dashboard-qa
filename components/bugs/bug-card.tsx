"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, ExternalLink, MoreVertical, AlertTriangle, Shield } from "lucide-react"
import type { Bug } from "@/lib/types"
import { useState } from "react"
import { BugFormModal } from "./bug-form-modal"

const STATUS_COLORS: Record<string, string> = {
  open: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  in_progress: "bg-warning/20 text-warning border-warning/30",
  resolved: "bg-success/20 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-border",
}

const STATUS_LABELS: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em Progresso",
  resolved: "Resolvido",
  closed: "Fechado",
}

const CRITICALITY_COLORS: Record<string, string> = {
  baixa: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  media: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  alta: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critica: "bg-red-500/10 text-red-500 border-red-500/20",
}

const CRITICALITY_LABELS: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
}

const RISK_COLORS: Record<string, string> = {
  baixo: "bg-green-500/10 text-green-500 border-green-500/20",
  medio: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  alto: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critico: "bg-red-500/10 text-red-500 border-red-500/20",
}

const RISK_LABELS: Record<string, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
  critico: "Crítico",
}

interface BugCardProps {
  bug: Bug
}

export function BugCard({ bug }: BugCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{bug.name}</h3>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap ${STATUS_COLORS[bug.status]}`}>
                {STATUS_LABELS[bug.status] || bug.status}
              </span>
              {bug.criticality && (
                <span className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap flex items-center gap-1.5 ${CRITICALITY_COLORS[bug.criticality]}`}>
                  <AlertTriangle className="w-3 h-3" />
                  {CRITICALITY_LABELS[bug.criticality] || bug.criticality}
                </span>
              )}
              {bug.risk && (
                <span className={`text-xs px-2 py-1 rounded-md border whitespace-nowrap flex items-center gap-1.5 ${RISK_COLORS[bug.risk]}`}>
                  <Shield className="w-3 h-3" />
                  {RISK_LABELS[bug.risk] || bug.risk}
                </span>
              )}
            </div>

            {bug.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bug.description}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Encontrado{" "}
                  {formatDistanceToNow(new Date(bug.found_date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              {bug.resolved_date && (
                <div className="flex items-center gap-2 text-success">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Resolvido{" "}
                    {formatDistanceToNow(new Date(bug.resolved_date), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-secondary rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">User Story</p>
              <p className="text-sm text-foreground line-clamp-2">
                {bug.user_story || <span className="italic text-muted-foreground/70">Não informado</span>}
              </p>
            </div>

            <div className="mt-3 p-3 bg-secondary rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Caso de Teste (Gherkin)</p>
              <pre className="text-xs text-foreground font-mono line-clamp-3 whitespace-pre-wrap">
                {bug.gherkin || <span className="italic text-muted-foreground/70">Não informado</span>}
              </pre>
            </div>

            <div className="mt-3">
              <a
                href={bug.evidence || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 text-xs ${bug.evidence ? "text-primary hover:underline" : "text-muted-foreground/50 cursor-not-allowed"}`}
              >
                <ExternalLink className="w-3 h-3" />
                {bug.evidence ? "Ver Evidências" : "Sem Evidências"}
              </a>
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

      <BugFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} bug={bug} />
    </>
  )
}
