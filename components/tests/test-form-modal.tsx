"use client"

import type React from "react"
import { X, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import type { Test } from "@/lib/types"
import { SearchableSelect } from "@/components/shared/searchable-select"

interface TestFormModalProps {
  isOpen: boolean
  onClose: () => void
  test?: Test
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TestFormModal({ isOpen, onClose, test }: TestFormModalProps) {
  const { data: testCasesData } = useSWR<{ testCases: { id: number; name: string }[] }>(
    isOpen ? "/api/test-cases?format=list" : null,
    fetcher
  );

  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    result: "pendente",
    type: "funcional",
    test_case_id: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (test) {
      setFormData({
        name: test.name || "",
        description: test.description || "",
        result: test.result || "pendente",
        type: test.type || "funcional",
        test_case_id: test.test_case_id ? String(test.test_case_id) : "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        result: "pendente",
        type: "funcional",
        test_case_id: "",
      })
    }
    setError("")
  }, [test, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.test_case_id) {
      setError("Selecione um Caso de Teste antes de salvar.")
      return
    }

    try {
      const isEdit = !!test && test.id
      const response = await fetch("/api/tests", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          test_case_id: formData.test_case_id ? Number(formData.test_case_id) : null,
          ...(isEdit ? { id: test.id } : {}),
        }),
      })
      if (!response.ok) throw new Error(isEdit ? "Erro ao atualizar teste" : "Erro ao criar teste")
      router.refresh()
      onClose()
    } catch (err) {
      setError(test ? "Erro ao atualizar o teste!" : "Erro ao criar o teste!")
    }
  }

  const handleDelete = async () => {
    if (!test || !test.id) return

    if (window.confirm("Tem certeza que deseja deletar este teste? Esta ação não pode ser desfeita.")) {
      setError("")
      try {
        const response = await fetch("/api/tests", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: test.id }),
        })
        if (!response.ok) throw new Error("Erro ao deletar teste")
        router.refresh()
        onClose()
      } catch (err) {
        setError("Erro ao deletar o teste!")
      }
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
                placeholder="Descreva o objetivo do teste..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tipo *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="funcional">Funcional</option>
                <option value="integracao">Integração</option>
                <option value="regressao">Regressão</option>
                <option value="unidade">Unidade</option>
                <option value="e2e">E2E</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Resultado *</label>
              <select value={formData.result} onChange={(e) => setFormData({ ...formData, result: e.target.value })} className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <SearchableSelect
                label="Caso de Teste Relacionado *"
                options={testCasesData?.testCases || []}
                value={formData.test_case_id}
                onChange={(value) => setFormData({ ...formData, test_case_id: value })}
                placeholder="Buscar caso de teste..."
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
            {test && (
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
              {test ? "Salvar Alterações" : "Criar Teste"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}