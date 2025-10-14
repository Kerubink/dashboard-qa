"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2 } from "lucide-react"
import type { Service } from "@/lib/types"
import { ServiceFormModal } from "./service-form-modal"

interface ServiceDetailsHeaderProps {
  service: Service
}

export function ServiceDetailsHeader({ service }: ServiceDetailsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleCloseModal = () => {
    setIsModalOpen(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este serviço? Todos os dados associados (casos de teste, testes, bugs) serão perdidos.")) {
      try {
        const response = await fetch("/api/services", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: service.id }),
        })

        if (!response.ok) {
          throw new Error("Falha ao excluir o serviço")
        }

        router.push("/services")
        router.refresh()
      } catch (error) {
        console.error(error)
        alert("Ocorreu um erro ao excluir o serviço.")
      }
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{service.name}</h1>
            {service.description && <p className="text-muted-foreground mt-2">{service.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors flex items-center gap-2 font-medium"
            >
              <Pencil className="w-4 h-4" /> Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
          </div>
        </div>
      </div>
      <ServiceFormModal isOpen={isModalOpen} onClose={handleCloseModal} service={service} />
    </>
  )
}