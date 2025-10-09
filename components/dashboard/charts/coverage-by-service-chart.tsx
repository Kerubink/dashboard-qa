"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CoverageByServiceChartProps {
  data: { service: string; coverage: number }[]
}

export function CoverageByServiceChart({ data }: CoverageByServiceChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Cobertura por Serviço</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis type="number" domain={[0, 100]} stroke="#a1a1a1" style={{ fontSize: "12px" }} />
          <YAxis type="category" dataKey="service" stroke="#a1a1a1" style={{ fontSize: "12px" }} width={120} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#ededed",
            }}
            formatter={(value) => `${value}%`}
          />
          <Bar dataKey="coverage" fill="#0070f3" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
