import { getAlerts } from "@/lib/db"
import { AlertTriangle, Clock, Bug, FlaskConical } from "lucide-react"

export async function AlertsSection() {
  const alerts = await getAlerts()

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-destructive/10">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Alertas</h2>
          <p className="text-sm text-muted-foreground">Itens que requerem atenção imediata</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.type === "bug" ? Bug : FlaskConical
          const severityColor = alert.severity === "critical" ? "text-destructive" : "text-warning"
          const bgColor = alert.severity === "critical" ? "bg-destructive/10" : "bg-warning/10"

          return (
            <div
              key={`${alert.type}-${alert.id}`}
              className={`${bgColor} border border-border rounded-lg p-4 hover:border-primary/50 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${severityColor} mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{alert.days_open} dias</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
