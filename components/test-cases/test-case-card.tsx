"use client"

import { Bot, MoreVertical } from "lucide-react"
import type { TestCase } from "@/lib/types"
import { useState } from "react"
import { TestCaseFormModal } from "./test-case-form-modal"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  done: "bg-success/20 text-success border-success/30",
  blocked: "bg-chart-5/20 text-chart-5 border-chart-5/30",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  done: "Feito",
  blocked: "Bloqueado",
}

interface TestCaseCardProps {
  testCase: TestCase
}

export function TestCaseCard({ testCase }: TestCaseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{testCase.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-md border ${STATUS_COLORS[testCase.status]}`}>
                {STATUS_LABELS[testCase.status] || testCase.status}
              </span>
              {testCase.is_automated && (
                <span className="text-xs px-2 py-1 rounded-md bg-chart-1/20 text-chart-1 border border-chart-1/30 flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  IA/Automático
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1 rounded-lg hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {testCase.user_story && (
          <div className="mb-3 p-3 bg-secondary rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">User Story</p>
            <p className="text-sm text-foreground line-clamp-2">{testCase.user_story}</p>
          </div>
        )}

        {testCase.gherkin && (
          <div className="mb-3 p-3 bg-secondary rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Gherkin</p>
            <pre className="text-xs text-foreground font-mono line-clamp-4 whitespace-pre-wrap">{testCase.gherkin}</pre>
          </div>
        )}

        {testCase.test_data && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Massa de Dados</p>
            <p className="text-xs text-foreground line-clamp-2">{testCase.test_data}</p>
          </div>
        )}

        {testCase.observations && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground line-clamp-2">{testCase.observations}</p>
          </div>
        )}
      </div>

      <TestCaseFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} testCase={testCase} />
    </>
  )
}
