import type React from "react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale/pt-BR"
import { Bug, FileCheck, FlaskConical } from "lucide-react"

interface RecentActivityProps {
  activities: any[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Atividades Recentes</h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">Nenhuma atividade recente encontrada.</p>
            <p className="text-muted-foreground text-xs mt-1">
              Crie um novo teste, bug ou melhoria para ver a atividade aqui.
            </p>
          </div>
        ) : (
          activities.map((activity: any, index: number) => {
            const Icon =
              activity.type === "test" ? FlaskConical : activity.type === "bug" ? Bug : FileCheck;

            return (
              <div key={activity.title + index} className="flex items-start gap-4 p-4 rounded-lg bg-secondary">
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === "test"
                      ? "bg-chart-1/20 text-chart-1" // FlaskConical
                      : activity.type === "bug"
                      ? "bg-chart-5/20 text-chart-5" // Bug
                      : "bg-chart-3/20 text-chart-3" // FileCheck
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
