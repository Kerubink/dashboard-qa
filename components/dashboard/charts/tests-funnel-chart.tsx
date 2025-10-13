"use client";

import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface TestsFunnelChartProps {
  data: any[];
}

export function TestsFunnelChart({ data }: TestsFunnelChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center h-80">
        <p className="text-muted-foreground">Dados do funil indisponíveis.</p>
      </div>
    );
  }

  // Transformar os dados para o formato do RadarChart
  const radarData = data.map(item => ({
    subject: item.stage,
    value: item.value,
    fullMark: Math.max(...data.map(d => d.value)) * 1.2, // 20% acima do maior valor
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Funil de Qualidade
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          <Radar 
            name="Valores" 
            dataKey="value" 
            stroke="var(--color-chart-1)" 
            fill="var(--color-chart-1)" 
            fillOpacity={0.6} 
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}