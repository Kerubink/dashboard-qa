# QA Dashboard - Sistema de Gestão de Qualidade

Dashboard profissional para gestão de testes, bugs, melhorias e qualidade de software.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Recharts** - Gráficos e visualizações

## 🐳 Como Rodar com Docker

### Pré-requisitos
- Docker
- Docker Compose

### Instalação

1. Clone o repositório e entre na pasta:
\`\`\`bash
cd qa-dashboard
\`\`\`

2. Crie o arquivo `.env` baseado no `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Inicie os containers:
\`\`\`bash
docker-compose up -d
\`\`\`

4. Acesse o dashboard:
\`\`\`
http://localhost:3000
\`\`\`

### Comandos Úteis

\`\`\`bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Acessar banco de dados
docker exec -it qa-dashboard-db psql -U qauser -d qa_dashboard
\`\`\`

## 📊 Funcionalidades

- ✅ Dashboard com KPIs e métricas estratégicas
- ✅ Gestão completa de testes (CRUD)
- ✅ Gestão de bugs com rastreamento
- ✅ Gestão de melhorias
- ✅ Casos de teste com Gherkin
- ✅ Planos de teste de performance
- ✅ Análise por serviço
- ✅ Gráficos e visualizações
- ✅ Filtros por data e outros campos
- ✅ Dark mode profissional

## 🗄️ Estrutura do Banco

- **services** - Serviços monitorados
- **tests** - Testes executados
- **bugs** - Bugs encontrados
- **improvements** - Melhorias propostas
- **test_cases** - Casos de teste
- **performance_plans** - Planos de performance

## 📝 Licença

MIT
\`\`\`

\`\`\`dockerignore file=".dockerignore"
node_modules
.next
.git
.env
.env.local
README.md
docker-compose.yml
Dockerfile
.dockerignore
