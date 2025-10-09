"use client"

import type React from "react"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import type { Service } from "@/lib/types"

interface ServiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  service?: Service
}

export function ServiceFormModal({ isOpen, onClose, service }: ServiceFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
      })
    }
  }, [service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to save service
    console.log("Saving service:", formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl">
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{service ? "Editar Serviço" : "Novo Serviço"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nome do Serviço *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: API Gateway"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Descreva o serviço..."
            />
          </div>

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
              {service ? "Salvar Alterações" : "Criar Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
