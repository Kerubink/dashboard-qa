"use client"

import type React from "react"
import { X, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import type { Bug } from "@/lib/types"
import { SearchableSelect } from "@/components/shared/searchable-select"

interface BugFormModalProps {
  isOpen: boolean
  onClose: () => void
  bug?: Bug
}

const DEFAULT_GHERKIN = `Cenário: [Título do cenário]
  Dado que [contexto inicial]
  Quando [ação realizada]
  Então [resultado esperado]
  E [condição adicional]`

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function BugFormModal({ isOpen, onClose, bug }: BugFormModalProps) {
  const { data: servicesData } = useSWR<{ services: { id: number; name: string }[] }>(
    isOpen ? "/api/services" : null,
    fetcher
  );
  const { data: testsData } = useSWR<{ tests: { id: number; name: string }[] }>(
    isOpen ? "/api/tests?format=list" : null,
    fetcher
  );

  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_story: "",
    gherkin: DEFAULT_GHERKIN,
    evidence: "",
    status: "open",
    criticality: "media",
    risk: "medio",
    observations: "",
    service_id: "",
    test_id: "",
    responsible_qa: "",
    responsible_dev: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (bug) {
      setFormData({
        name: bug.name || "",
        description: bug.description || "",
        user_story: bug.user_story || "",
        gherkin: bug.gherkin || DEFAULT_GHERKIN,
        evidence: bug.evidence || "",
        status: bug.status || "open",
        criticality: bug.criticality || "media",
        risk: bug.risk || "medio",
        observations: bug.observations || "",
        service_id: bug.service_id !== null && bug.service_id !== undefined ? String(bug.service_id) : "",
        test_id: bug.test_id !== null && bug.test_id !== undefined ? String(bug.test_id) : "",
        responsible_qa: bug.responsible_qa || "",
        responsible_dev: bug.responsible_dev || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        user_story: "",
        gherkin: DEFAULT_GHERKIN,
        evidence: "",
        status: "open",
        criticality: "media",
        risk: "medio",
        observations: "",
        service_id: "",
        test_id: "",
        responsible_qa: "",
        responsible_dev: "",
      })
    }
    setError("")
  }, [bug, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.service_id || !formData.test_id) {
      setError("Os campos 'Serviço' e 'Teste Relacionado' são obrigatórios.")
      return
    }
    try {
      const isEdit = !!bug && bug.id
      const response = await fetch("/api/bugs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service_id: formData.service_id ? Number(formData.service_id) : null,
          test_id: formData.test_id ? Number(formData.test_id) : null,
          ...(isEdit ? { id: bug.id } : {}),
        }),
      })
      if (!response.ok) throw new Error(isEdit ? "Erro ao atualizar bug" : "Erro ao criar bug")
      router.refresh()
      onClose()
    } catch (err) {
      setError(bug ? "Erro ao atualizar bug!" : "Erro ao criar bug!")
    }
  }

  const handleDelete = async () => {
    if (!bug || !bug.id) return

    if (window.confirm("Tem certeza que deseja deletar este bug? Esta ação não pode ser desfeita.")) {
      setError("")
      try {
        const response = await fetch("/api/bugs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: bug.id }),
        })
        if (!response.ok) throw new Error("Erro ao deletar bug")
        router.refresh()
        onClose()
      } catch (err) {
        setError("Erro ao deletar o bug!")
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-foreground">{bug ? "Editar Bug" : "Novo Bug"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Bug *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Erro ao fazer login com email inválido"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva o bug encontrado..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Criticidade *</label>
              <select
                required
                value={formData.criticality}
                onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Risco *</label>
              <select
                required
                value={formData.risk}
                onChange={(e) => setFormData({ ...formData, risk: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="open">Aberto</option>
                <option value="in_progress">Em Progresso</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>

            <div>
              <SearchableSelect
                label="Teste Relacionado *"
                options={testsData?.tests || []}
                value={formData.test_id}
                onChange={(value) => setFormData({ ...formData, test_id: value })}
                placeholder="Buscar teste..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <SearchableSelect
                label="Serviço *"
                options={servicesData?.services || []}
                value={formData.service_id}
                onChange={(value) => setFormData({ ...formData, service_id: value })}
                placeholder="Buscar serviço..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">QA Responsável</label>
              <input
                type="text"
                value={formData.responsible_qa}
                onChange={(e) => setFormData({ ...formData, responsible_qa: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome do QA que encontrou o bug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Dev Responsável</label>
              <input
                type="text"
                value={formData.responsible_dev}
                onChange={(e) => setFormData({ ...formData, responsible_dev: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome do Dev que vai resolver"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">User Story</label>
              <textarea
                value={formData.user_story}
                onChange={(e) => setFormData({ ...formData, user_story: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Como [usuário], eu quero [ação], para [benefício]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Caso de Teste (Gherkin)</label>
              <textarea
                value={formData.gherkin}
                onChange={(e) => setFormData({ ...formData, gherkin: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Evidências *</label>
              <textarea
                required
                value={formData.evidence}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva as evidências, links, prints, logs, etc."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Observações</label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Observações adicionais sobre o bug..."
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
            {bug && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Deletar
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {bug ? "Salvar Alterações" : "Criar Bug"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
