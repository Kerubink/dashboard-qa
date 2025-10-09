import { getRecentActivities } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FlaskConical, Bug, FileCheck } from "lucide-react"

export async function RecentActivity() {
  const activities = await getRecentActivities()

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Atividades Recentes</h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">Nenhuma atividade recente</p>
        ) : (
          activities.map((activity, index) => {
            const Icon = activity.type === "test" ? FlaskConical : activity.type === "bug" ? Bug : FileCheck

            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-secondary hover:bg-accent transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === "test"
                      ? "bg-chart-1/20 text-chart-1"
                      : activity.type === "bug"
                        ? "bg-chart-5/20 text-chart-5"
                        : "bg-chart-3/20 text-chart-3"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
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
