"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface ServiceRelatedItemsProps {
  children: React.ReactNode
}

export function ServiceRelatedItems({ children }: ServiceRelatedItemsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const activeTab = searchParams.get("tab") || "test-cases"

  const tabs = [
    { id: "test-cases", label: "Casos de Teste" },
    { id: "tests", label: "Testes" },
  ]

  return (
    <div className={cn("bg-card border border-border rounded-lg", isPending && "opacity-70")}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set("tab", tab.id)
                startTransition(() => {
                  router.replace(`${pathname}?${params.toString()}`)
                })
              }}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}