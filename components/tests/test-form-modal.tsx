"use client"

import type React from "react"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Test } from "@/lib/types"
import { SearchableSelect } from "@/components/shared/searchable-select"

interface TestFormModalProps {
  isOpen: boolean
  onClose: () => void
  test?: Test
  bugs?: { id: number; name: string }[]
  services?: { id: number; name: string }[]
  testCases?: { id: number; name: string }[]
}

export function TestFormModal({ isOpen, onClose, test, bugs = [], services = [], testCases = [] }: TestFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "funcional",
    result: "pending",
    execution_type: "manual",
    execution_location: "",
    execution_method: "",
    test_data: "",
    jira_link: "",
    bug_link: "",
    evidence: "",
    responsible_qa: "",
    responsible_dev: "",
    service_id: "",
    test_case_id: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (test) {
      setFormData({
        name: test.name || "",
        description: test.description || "",
        type: test.type || "funcional",
        result: test.result || "pending",
        execution_type: test.execution_type || "manual",
        execution_location: test.execution_location || "",
        execution_method: test.execution_method || "",
        test_data: test.test_data || "",
        jira_link: test.jira_link || "",
        bug_link: test.bug_link || "",
        evidence: test.evidence || "",
        responsible_qa: test.responsible_qa || "",
        responsible_dev: test.responsible_dev || "",
        service_id: test.service_id ? String(test.service_id) : "",
        test_case_id: test.test_case_id ? String(test.test_case_id) : "",
      })
    }
  }, [test])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.service_id) {
      setError("Selecione um serviço antes de salvar.")
      return
    }
    try {
      const isEdit = !!test && test.id
      const response = await fetch("/api/tests", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service_id: formData.service_id ? Number(formData.service_id) : null,
          test_case_id: formData.test_case_id ? Number(formData.test_case_id) : null,
          ...(isEdit ? { id: test.id } : {}),
        }),
      })
      if (!response.ok) throw new Error(isEdit ? "Erro ao atualizar teste" : "Erro ao criar teste")
      router.refresh()
      onClose()
    } catch (err) {
      setError(test ? "Erro ao atualizar teste!" : "Erro ao criar teste!")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-foreground">{test ? "Editar Teste" : "Novo Teste"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Teste *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Teste de login com credenciais válidas"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva o objetivo e escopo do teste..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de Teste *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="unitario">Unitário</option>
                <option value="funcional">Funcional</option>
                <option value="performance">Performance</option>
                <option value="contrato">Contrato</option>
                <option value="regressao">Regressão</option>
                <option value="exploratorio">Exploratório</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Resultado *</label>
              <select
                required
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="falho">Falho</option>
                <option value="quebrado">Quebrado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de Execução</label>
              <select
                value={formData.execution_type}
                onChange={(e) => setFormData({ ...formData, execution_type: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="manual">Manual</option>
                <option value="automatico">Automático</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Onde foi Executado</label>
              <input
                type="text"
                value={formData.execution_location}
                onChange={(e) => setFormData({ ...formData, execution_location: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Ambiente de homologação"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Como foi Executado</label>
              <input
                type="text"
                value={formData.execution_method}
                onChange={(e) => setFormData({ ...formData, execution_method: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Cypress, Postman, Manual via navegador"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Responsável QA</label>
              <input
                type="text"
                value={formData.responsible_qa}
                onChange={(e) => setFormData({ ...formData, responsible_qa: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome do QA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Responsável Dev</label>
              <input
                type="text"
                value={formData.responsible_dev}
                onChange={(e) => setFormData({ ...formData, responsible_dev: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nome do Dev"
              />
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

            <div>
              <SearchableSelect
                label="Caso de Teste"
                options={testCases}
                value={formData.test_case_id}
                onChange={(value) => setFormData({ ...formData, test_case_id: value })}
                placeholder="Buscar caso de teste..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Link do Jira</label>
              <input
                type="url"
                value={formData.jira_link}
                onChange={(e) => setFormData({ ...formData, jira_link: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
            </div>

            <div>
              <SearchableSelect
                label="Bug Relacionado"
                options={bugs}
                value={formData.bug_link}
                onChange={(value) => setFormData({ ...formData, bug_link: value })}
                placeholder="Buscar bug..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Massa de Dados</label>
              <textarea
                value={formData.test_data}
                onChange={(e) => setFormData({ ...formData, test_data: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Dados utilizados no teste..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Evidências (opcional)</label>
              <textarea
                value={formData.evidence}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Links para screenshots, vídeos, logs..."
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
              {test ? "Salvar Alterações" : "Criar Teste"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
