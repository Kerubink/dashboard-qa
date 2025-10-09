"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ["#0070f3", "#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]

const TYPE_LABELS: Record<string, string> = {
  unitario: "Unitário",
  funcional: "Funcional",
  performance: "Performance",
  contrato: "Contrato",
  regressao: "Regressão",
  exploratorio: "Exploratório",
}

interface TestsByTypeChartProps {
  data: { type: string; count: number }[]
}

export function TestsByTypeChart({ data }: TestsByTypeChartProps) {
  const chartData = data.map((item) => ({
    name: TYPE_LABELS[item.type] || item.type,
    value: item.count,
  }))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Testes por Tipo</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#ededed",
            }}
          />
          <Legend wrapperStyle={{ color: "#a1a1a1" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
