#!/bin/bash

echo "🚀 Iniciando Dashboard de Qualidade..."
echo ""

# Verifica se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Cria .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Sobe os containers
echo "🐳 Subindo containers Docker..."
docker-compose up -d

# Aguarda o PostgreSQL ficar pronto
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 5

# Verifica status
echo ""
echo "✅ Containers rodando:"
docker-compose ps

echo ""
echo "🎉 Dashboard disponível em: http://localhost:3000"
echo "🗄️  PostgreSQL disponível em: localhost:5432"
echo ""
echo "📋 Comandos úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar: docker-compose down"
echo "  - Reconstruir: docker-compose up -d --build"
