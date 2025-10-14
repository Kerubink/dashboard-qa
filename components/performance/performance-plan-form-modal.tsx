"use client"

import type React from "react"
import { X, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import type { PerformancePlan } from "@/lib/types"
import { SearchableSelect } from "@/components/shared/searchable-select"

interface PerformancePlanFormModalProps {
  isOpen: boolean
  onClose: () => void
  plan?: PerformancePlan
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PerformancePlanFormModal({ isOpen, onClose, plan }: PerformancePlanFormModalProps) {
  const { data: servicesData } = useSWR<{ services: { id: number; name: string }[] }>(
    isOpen ? "/api/services" : null,
    fetcher
  );

  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    test_type: "",
    target_metrics: "",
    test_data: "",
    results: "",
    status: "planned",
    observations: "",
    service_id: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        test_type: plan.test_type || "",
        target_metrics: plan.target_metrics || "",
        test_data: plan.test_data || "",
        results: plan.results || "",
        status: plan.status || "planned",
        observations: plan.observations || "",
        service_id: plan.service_id ? String(plan.service_id) : "",
      })
    }
  }, [plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.service_id) {
      setError("Selecione um serviço antes de salvar.")
      return
    }
    try {
      const isEdit = !!plan && plan.id
      const response = await fetch("/api/performance", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service_id: formData.service_id ? Number(formData.service_id) : null,
          ...(isEdit ? { id: plan.id } : {}),
        }),
      })
      if (!response.ok) throw new Error(isEdit ? "Erro ao atualizar plano de performance" : "Erro ao criar plano de performance")
      router.refresh()
      onClose()
    } catch (err) {
      setError(plan ? "Erro ao atualizar plano de performance!" : "Erro ao criar plano de performance!")
    }
  }

  const handleDelete = async () => {
    if (!plan || !plan.id) return

    if (window.confirm("Tem certeza que deseja deletar este plano? Esta ação não pode ser desfeita.")) {
      setError("")
      try {
        const response = await fetch("/api/performance", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: plan.id }),
        })
        if (!response.ok) throw new Error("Erro ao deletar plano")
        router.refresh()
        onClose()
      } catch (err) {
        setError("Erro ao deletar o plano!")
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {plan ? "Editar Plano de Performance" : "Novo Plano de Performance"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Plano *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Teste de carga - API de pagamentos"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Descrição *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva o objetivo do teste de performance..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo de Teste *</label>
              <input
                type="text"
                value={formData.test_type}
                onChange={(e) => setFormData({ ...formData, test_type: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Teste de Carga, Stress, Spike"
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
                <option value="planned">Planejado</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluído</option>
                <option value="failed">Falhou</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Métricas Alvo *</label>
              <textarea
                value={formData.target_metrics}
                onChange={(e) => setFormData({ ...formData, target_metrics: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Ex: Tempo de resposta < 200ms, Taxa de erro < 1%, Throughput > 1000 req/s"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Massa de Dados / Cenário *</label>
              <textarea
                value={formData.test_data}
                onChange={(e) => setFormData({ ...formData, test_data: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descreva o cenário de teste, usuários virtuais, dados utilizados..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Resultados *</label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Resultados obtidos, métricas alcançadas, problemas encontrados..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Observações</label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Observações adicionais sobre o teste..."
              />
            </div>

            <div>
              <SearchableSelect
                label="Serviço *"
                options={servicesData?.services || []}
                value={formData.service_id}
                onChange={(value) => setFormData({ ...formData, service_id: value })}
                placeholder="Buscar serviço..."
                required
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
            {plan && (
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
              {plan ? "Salvar Alterações" : "Criar Plano"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
