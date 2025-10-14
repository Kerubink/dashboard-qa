"use client"

import Link from "next/link"
import { Server, TrendingUp, Bug, FileCheck, FlaskConical } from "lucide-react"

interface ServiceCardProps {
  service: {
    id: number
    name: string
    description: string
    total_tests: string
    passed_tests: string
    total_bugs: string
    open_bugs: string
    total_test_cases: string,
    executed_test_cases: string
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  const totalTestCases = Number.parseInt(service.total_test_cases || "0")
  const executedTestCases = Number.parseInt(service.executed_test_cases || "0")
  const coverage = totalTestCases > 0 ? Math.round((executedTestCases / totalTestCases) * 100) : 0

  return (
    <Link href={`/services/${service.id}`}>
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-secondary text-primary">
            <Server className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">{service.name}</h3>
            {service.description && <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-chart-1" />
              <span className="text-sm text-muted-foreground">Cobertura</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{coverage}%</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-secondary rounded-lg text-center">
              <FlaskConical className="w-4 h-4 text-chart-1 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Testes</p>
              <p className="text-sm font-semibold text-foreground">{service.total_tests}</p>
            </div>

            <div className="p-2 bg-secondary rounded-lg text-center">
              <Bug className="w-4 h-4 text-chart-5 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Bugs</p>
              <p className="text-sm font-semibold text-foreground">{service.open_bugs}</p>
            </div>

            <div className="p-2 bg-secondary rounded-lg text-center">
              <FileCheck className="w-4 h-4 text-chart-3 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Casos</p>
              <p className="text-sm font-semibold text-foreground">{service.total_test_cases}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
