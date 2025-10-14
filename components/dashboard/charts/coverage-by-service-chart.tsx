"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

const COLORS = ["#0070f3", "#00a8e8", "#00c9a7", "#f9a825", "#ff6f61"]

interface CoverageByServiceChartProps {
  data: {
    status: string
    [service: string]: number | string
  }[]
  services: string[]
}

export function CoverageByServiceChart({ data, services }: CoverageByServiceChartProps) {
  // Definir a ordem específica dos status
  const statusOrder = ["pendente", "aprovado", "reprovado", "bloqueado"]
  
  // Ordenar os dados conforme a ordem definida
  const sortedData = [...data].sort((a, b) => 
    statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  )

  // Transformar os dados para o formato do RadarChart
  const radarData = sortedData.map(item => {
    const radarItem: any = { subject: item.status }
    
    // Adicionar cada serviço como uma propriedade
    services.forEach(service => {
      radarItem[service] = item[service] || 0
    })
    
    return radarItem
  })

  // Calcular o valor máximo para o domínio do eixo
  const maxValue = Math.max(
    ...data.flatMap(item => 
      services.map(service => Number(item[service]) || 0)
    )
  )

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Status de Testes por Serviço</h3>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="#262626" />
          <PolarAngleAxis 
            dataKey="subject" 
            stroke="#a1a1a1" 
            style={{ fontSize: "12px" }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, Math.ceil(maxValue * 1.1)]} // 10% acima do valor máximo
            stroke="#a1a1a1" 
            style={{ fontSize: "12px" }} 
          />
          
          {services.map((service, index) => (
            <Radar
              key={service}
              name={service}
              dataKey={service}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
            />
          ))}
          
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#ededed",
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}