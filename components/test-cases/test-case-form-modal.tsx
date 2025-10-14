"use client"

import type React from "react"

import { X, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import type { TestCase } from "@/lib/types"
import { SearchableSelect } from "@/components/shared/searchable-select"

interface TestCaseFormModalProps {
  isOpen: boolean
  onClose: () => void
  testCase?: TestCase
}

const DEFAULT_GHERKIN = `Cenário: [Título do cenário]
  Dado que [contexto inicial]
  E [contexto adicional]
  Quando [ação do usuário]
  E [ação adicional]
  Então [resultado esperado]
  E [resultado adicional]`

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TestCaseFormModal({ isOpen, onClose, testCase }: TestCaseFormModalProps) {
  const { data: servicesData } = useSWR<{ services: { id: number; name: string }[] }>(
    isOpen ? "/api/services" : null,
    fetcher
  )
  const { data: nextIdData } = useSWR<{ nextId: number }>(
    isOpen && !testCase ? "/api/test-cases?nextId=true" : null,
    fetcher
  )

  const router = useRouter()
  const [testCasePrefix, setTestCasePrefix] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    user_story: "",
    gherkin: DEFAULT_GHERKIN,
    test_data: "",
    status: "pending",
    is_automated: false,
    observations: "",
    service_id: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (testCase) {
      const [prefix, ...nameParts] = testCase.name.split(" - ")
      setTestCasePrefix(prefix)
      setFormData({
        name: nameParts.join(" - ") || "",
        user_story: testCase.user_story || "",
        gherkin: testCase.gherkin || DEFAULT_GHERKIN,
        test_data: testCase.test_data || "",
        status: testCase.status || "pending",
        is_automated: testCase.is_automated || false,
        observations: testCase.observations || "",
        service_id: testCase.service_id ? String(testCase.service_id) : "",
      })
    } else if (nextIdData) {
      const ctNumber = String(nextIdData.nextId).padStart(4, "0")
      setTestCasePrefix(`CT${ctNumber}`)
      setFormData({
        name: "",
        user_story: "",
        gherkin: DEFAULT_GHERKIN,
        test_data: "",
        status: "pending",
        is_automated: false,
        observations: "",
        service_id: "",
      })
    }
  }, [testCase, isOpen, nextIdData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.service_id) {
      setError("Selecione um serviço antes de salvar.")
      return
    }
    try {
      const isEdit = !!testCase && testCase.id
      const response = await fetch("/api/test-cases", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // Spread the rest of the form data
          name: `${testCasePrefix} - ${formData.name}`, // Combine prefix and name
          service_id: formData.service_id ? Number(formData.service_id) : null,
          ...(isEdit ? { id: testCase.id } : {}),
        }),
      })
      if (!response.ok) throw new Error(isEdit ? "Erro ao atualizar caso de teste" : "Erro ao criar caso de teste")
      router.refresh()
      onClose()
    } catch (err) {
      setError(testCase ? "Erro ao atualizar caso de teste!" : "Erro ao criar caso de teste!")
    }
  }

  const handleDelete = async () => {
    if (!testCase || !testCase.id) return

    if (window.confirm("Tem certeza que deseja deletar este caso de teste? Esta ação não pode ser desfeita.")) {
      setError("")
      try {
        const response = await fetch("/api/test-cases", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: testCase.id }),
        })
        if (!response.ok) throw new Error("Erro ao deletar caso de teste")
        router.refresh()
        onClose()
      } catch (err) {
        setError("Erro ao deletar o caso de teste!")
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-foreground">
            {testCase ? "Editar Caso de Teste" : "Novo Caso de Teste"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Nome do Caso de Teste *</label>
              <div className="flex items-center">
                <span className="px-2 py-2 w-36 bg-secondary border border-r-0 border-border rounded-l-lg text-muted-foreground font-mono">
                  {testCasePrefix} -
                </span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary text-foreground rounded-r-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Validar login com sucesso"
                  disabled={!testCasePrefix}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pendente</option>
                <option value="done">Feito</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>

            <div>
              <SearchableSelect
                label="Serviço "
                options={servicesData?.services || []}
                value={formData.service_id}
                onChange={(value) => setFormData({ ...formData, service_id: value })}
                placeholder="Buscar serviço..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_automated}
                  onChange={(e) => setFormData({ ...formData, is_automated: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium text-foreground">Automático / IA</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">User Story *</label>
              <textarea
                required
                value={formData.user_story}
                onChange={(e) => setFormData({ ...formData, user_story: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Como [usuário], eu quero [ação], para [benefício]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Gherkin (Passo a Passo) *
                <span className="text-xs text-muted-foreground ml-2">(Template pré-preenchido para edição)</span>
              </label>
              <textarea
                required
                value={formData.gherkin}
                onChange={(e) => setFormData({ ...formData, gherkin: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Massa de Dados *</label>
              <textarea
                required
                value={formData.test_data}
                onChange={(e) => setFormData({ ...formData, test_data: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Dados necessários para executar o teste..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Observações *</label>
              <textarea
                required
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Observações sobre o caso de teste..."
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
            {testCase && (
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
              {testCase ? "Salvar Alterações" : "Criar Caso de Teste"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
