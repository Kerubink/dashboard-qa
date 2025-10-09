"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FlaskConical, Bug, Lightbulb, FileText, Gauge, Server } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Testes", href: "/tests", icon: FlaskConical },
  { name: "Bugs", href: "/bugs", icon: Bug },
  { name: "Melhorias", href: "/improvements", icon: Lightbulb },
  { name: "Casos de Teste", href: "/test-cases", icon: FileText },
  { name: "Performance", href: "/performance", icon: Gauge },
  { name: "Serviços", href: "/services", icon: Server },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">QA Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestão de Qualidade</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>v1.0.0</p>
          <p className="mt-1">Docker + PostgreSQL</p>
        </div>
      </div>
    </aside>
  )
}
