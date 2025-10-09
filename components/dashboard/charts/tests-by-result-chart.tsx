"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const RESULT_LABELS: Record<string, string> = {
  aprovado: "Aprovado",
  falho: "Falho",
  quebrado: "Quebrado",
  pending: "Pendente",
}

const RESULT_COLORS: Record<string, string> = {
  aprovado: "#10b981",
  falho: "#ef4444",
  quebrado: "#f59e0b",
  pending: "#a1a1a1",
}

interface TestsByResultChartProps {
  data: { result: string; count: number }[]
}

export function TestsByResultChart({ data }: TestsByResultChartProps) {
  const chartData = data.map((item) => ({
    name: RESULT_LABELS[item.result] || item.result,
    value: item.count,
    fill: RESULT_COLORS[item.result] || "#0070f3",
  }))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Resultados dos Testes</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis dataKey="name" stroke="#a1a1a1" style={{ fontSize: "12px" }} />
          <YAxis stroke="#a1a1a1" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#ededed",
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
