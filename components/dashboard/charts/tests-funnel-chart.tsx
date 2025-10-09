"use client"

interface TestsFunnelChartProps {
  data: { stage: string; value: number }[]
}

export function TestsFunnelChart({ data }: TestsFunnelChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Funil de Qualidade</h3>

      <div className="space-y-4 mt-6">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          const colors = ["#0070f3", "#7c3aed", "#10b981", "#ef4444"]

          return (
            <div key={item.stage} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.stage}</span>
                <span className="text-foreground font-semibold">{item.value}</span>
              </div>
              <div className="relative h-12 bg-secondary rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 flex items-center justify-center text-white font-semibold transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                >
                  {percentage > 20 && `${percentage.toFixed(0)}%`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
