"use client"

import type React from "react"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Improvement } from "@/lib/types"
import { SearchableSelect } from "@/components/shared/searchable-select"

interface ImprovementFormModalProps {
  isOpen: boolean
  onClose: () => void
  improvement?: Improvement
  services?: { id: number; name: string }[]
}

const DEFAULT_GHERKIN = `Cenário: [Título da melhoria]
  Dado que [situação atual]
  Quando [melhoria for implementada]
  Então [resultado esperado]
  E [benefício adicional]`

export function ImprovementFormModal({ isOpen, onClose, improvement, services = [] }: ImprovementFormModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_story: "",
    gherkin: DEFAULT_GHERKIN,
    evidence: "",
    status: "proposed",
    observations: "",
    service_id: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (improvement) {
      setFormData({
        name: improvement.name || "",
        description: improvement.description || "",
        user_story: improvement.user_story || "",
        gherkin: DEFAULT_GHERKIN,
        evidence: improvement.evidence || "",
        status: improvement.status || "proposed",
        observations: improvement.observations || "",
        service_id: improvement.service_id ? String(improvement.service_id) : "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        user_story: "",
        gherkin: DEFAULT_GHERKIN,
        evidence: "",
        status: "proposed",
        observations: "",
        service_id: "",
      })
    }
  }, [improvement, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.service_id) {
      setError("Selecione um serviço antes de salvar.")
      return
    }
    try {
      const isEdit = !!improvement && improvement.id
      const response = await fetch("/api/improvements", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service_id: formData.service_id ? Number(formData.service_id) : null,
          ...(isEdit ? { id: improvement.id } : {}),
        }),
      })
      if (!response.ok) throw new Error(isEdit ? "Erro ao atualizar melhoria" : "Erro ao criar melhoria")
      router.refresh()
      onClose()
    } catch (err) {
      setError(improvement ? "Erro ao atualizar melhoria!" : "Erro ao criar melhoria!")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-foreground">{improvement ? "Editar Melhoria" : "Nova Melhoria"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nome da Melhoria *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Adicionar cache para melhorar performance"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Descrição *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva a melhoria proposta..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="proposed">Proposta</option>
                <option value="approved">Aprovada</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluída</option>
                <option value="rejected">Rejeitada</option>
              </select>
            </div>

            <div>
              <SearchableSelect
                label="Serviço *"
                options={services}
                value={formData.service_id}
                onChange={(value) => setFormData({ ...formData, service_id: value })}
                placeholder="Buscar serviço..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">User Story *</label>
              <textarea
                value={formData.user_story}
                onChange={(e) => setFormData({ ...formData, user_story: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Como [usuário], eu quero [ação], para [benefício]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Cenário da Melhoria (Gherkin)
                <span className="text-xs text-muted-foreground ml-2">(Template pré-preenchido para edição)</span>
              </label>
              <textarea
                value={formData.gherkin}
                onChange={(e) => setFormData({ ...formData, gherkin: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Evidências</label>
              <input
                type="url"
                value={formData.evidence}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Link para documentação, protótipos..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Observações</label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Observações adicionais sobre a melhoria..."
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-secondary text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {improvement ? "Salvar Alterações" : "Criar Melhoria"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
