// Mock data para preview quando não há conexão com banco de dados

export const mockServices = [
  { id: 1, name: "API Gateway", description: "Serviço de gateway principal", coverage: 85 },
  { id: 2, name: "Auth Service", description: "Serviço de autenticação", coverage: 92 },
  { id: 3, name: "Payment Service", description: "Processamento de pagamentos", coverage: 78 },
  { id: 4, name: "User Service", description: "Gestão de usuários", coverage: 88 },
  { id: 5, name: "Notification Service", description: "Envio de notificações", coverage: 65 },
]

export const mockTests = [
  {
    id: 1,
    name: "Login com credenciais válidas",
    description: "Testa o fluxo de login com usuário e senha corretos",
    type: "funcional",
    result: "aprovado",
    execution_type: "automatico",
    responsible: "João Silva",
    service_id: 2,
    created_at: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Teste de carga - 1000 usuários",
    description: "Verifica performance com 1000 usuários simultâneos",
    type: "performance",
    result: "aprovado",
    execution_type: "automatico",
    responsible: "Maria Santos",
    service_id: 1,
    created_at: new Date("2024-01-14"),
  },
  {
    id: 3,
    name: "Validação de contrato API",
    description: "Valida schema de resposta da API",
    type: "contrato",
    result: "falho",
    execution_type: "automatico",
    responsible: "Pedro Costa",
    service_id: 1,
    created_at: new Date("2024-01-13"),
  },
  {
    id: 4,
    name: "Teste unitário - Cálculo de juros",
    description: "Valida cálculo de juros compostos",
    type: "unitario",
    result: "aprovado",
    execution_type: "automatico",
    responsible: "Ana Lima",
    service_id: 3,
    created_at: new Date("2024-01-12"),
  },
  {
    id: 5,
    name: "Regressão - Fluxo de checkout",
    description: "Testa todo o fluxo de compra",
    type: "regressao",
    result: "quebrado",
    execution_type: "manual",
    responsible: "Carlos Souza",
    service_id: 3,
    created_at: new Date("2024-01-11"),
  },
]

export const mockBugs = [
  {
    id: 1,
    name: "Erro ao processar pagamento com cartão expirado",
    description: "Sistema não valida data de expiração do cartão",
    priority: "alta",
    criticality: "critica",
    risk: "alto",
    status: "aberto",
    test_id: 3,
    service_id: 3,
    responsible_qa: "Maria Santos",
    responsible_dev: "Carlos Silva",
    created_at: new Date("2024-01-13"),
  },
  {
    id: 2,
    name: "Timeout na API de notificações",
    description: "API demora mais de 30s para responder",
    priority: "media",
    criticality: "alta",
    risk: "medio",
    status: "aberto",
    test_id: 2,
    service_id: 5,
    responsible_qa: "João Costa",
    responsible_dev: "Ana Lima",
    created_at: new Date("2024-01-10"),
  },
  {
    id: 3,
    name: "Login falha com caracteres especiais",
    description: "Senha com @ não é aceita",
    priority: "baixa",
    criticality: "media",
    risk: "baixo",
    status: "fechado",
    test_id: 1,
    service_id: 2,
    responsible_qa: "Pedro Souza",
    responsible_dev: "Lucas Oliveira",
    created_at: new Date("2024-01-05"),
    resolved_at: new Date("2024-01-08"),
  },
]

export const mockTestCases = [
  {
    id: 1,
    name: "CT001 - Login com sucesso",
    description: "Caso de teste para login válido",
    service_id: 2,
    status: "testado",
    is_automated: true,
    gherkin:
      "Dado que o usuário está na tela de login\nQuando preenche credenciais válidas\nEntão deve acessar o sistema",
  },
  {
    id: 2,
    name: "CT002 - Teste de carga",
    description: "Caso de teste de performance",
    service_id: 1,
    status: "testado",
    is_automated: true,
    gherkin:
      "Dado que o sistema está em produção\nQuando 1000 usuários acessam simultaneamente\nEntão o tempo de resposta deve ser < 2s",
  },
  {
    id: 3,
    name: "CT003 - Validação de pagamento",
    description: "Caso de teste para fluxo de pagamento",
    service_id: 3,
    status: "nao_testado",
    is_automated: false,
    gherkin: "Dado que o usuário tem um carrinho\nQuando finaliza a compra\nEntão o pagamento deve ser processado",
  },
]

export const mockImprovements = [
  {
    id: 1,
    name: "Melhorar tempo de resposta da API",
    description: "Otimizar queries do banco de dados",
    priority: "alta",
    status: "em_andamento",
    service_id: 1,
    created_at: new Date("2024-01-10"),
  },
  {
    id: 2,
    name: "Adicionar cache em endpoints críticos",
    description: "Implementar Redis para cache",
    priority: "media",
    status: "planejado",
    service_id: 1,
    created_at: new Date("2024-01-08"),
  },
]

export const mockPerformancePlans = [
  {
    id: 1,
    name: "Teste de Carga - Black Friday",
    description: "Simular tráfego de Black Friday",
    service_id: 1,
    target_users: 10000,
    duration_minutes: 60,
    status: "concluido",
    created_at: new Date("2024-01-05"),
  },
  {
    id: 2,
    name: "Teste de Stress - API Gateway",
    description: "Encontrar limite do gateway",
    service_id: 1,
    target_users: 50000,
    duration_minutes: 30,
    status: "planejado",
    created_at: new Date("2024-01-12"),
  },
]

// Funções auxiliares para estatísticas
export function getMockStats() {
  const totalTests = mockTests.length
  const passedTests = mockTests.filter((t) => t.result === "aprovado").length
  const failedTests = mockTests.filter((t) => t.result === "falho").length
  const brokenTests = mockTests.filter((t) => t.result === "quebrado").length
  const openBugs = mockBugs.filter((b) => b.status === "aberto").length
  const totalTestCases = mockTestCases.length
  const averageCoverage = Math.round(mockServices.reduce((acc, s) => acc + s.coverage, 0) / mockServices.length)
  const totalServices = mockServices.length

  return {
    totalTests,
    passedTests,
    failedTests,
    brokenTests,
    openBugs,
    totalTestCases,
    averageCoverage,
    totalServices,
  }
}

export function getMockTestsByType() {
  const types = mockTests.reduce(
    (acc, test) => {
      acc[test.type] = (acc[test.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(types).map(([type, count]) => ({ type, count }))
}

export function getMockTestsByResult() {
  const results = mockTests.reduce(
    (acc, test) => {
      acc[test.result] = (acc[test.result] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(results).map(([result, count]) => ({ result, count }))
}

export function getMockCoverageByService() {
  return mockServices.map((service) => ({
    service: service.name,
    coverage: service.coverage,
  }))
}

export function getMockFunnelData() {
  const stats = getMockStats()
  return [
    { stage: "Casos de Teste", value: stats.totalTestCases },
    { stage: "Testes Executados", value: stats.totalTests },
    { stage: "Testes Aprovados", value: stats.passedTests },
    { stage: "Bugs Encontrados", value: stats.openBugs },
  ]
}
