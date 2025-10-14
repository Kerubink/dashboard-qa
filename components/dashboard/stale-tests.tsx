import { Clock } from "lucide-react"

interface TestAlert {
  id: number
  title: string
  description: string
  days_open: number
}

interface StaleTestsProps {
  tests: TestAlert[]
}

export function StaleTests({ tests }: StaleTestsProps) {
  if (tests.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-warning" />
        Testes Desatualizados
      </h3>
      <div className="space-y-3">
        {tests.map((test) => (
          <div key={test.id} className="p-3 bg-secondary rounded-lg border border-warning/20">
            <p className="font-medium text-warning">{test.title}</p>
            <p className="text-sm text-muted-foreground">{test.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}