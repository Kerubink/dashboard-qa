# 1. Estágio Base: Define a imagem Node.js a ser usada
FROM node:20-alpine AS base

# 2. Estágio de Dependências: Instala as dependências e aproveita o cache do Docker
FROM base AS deps
WORKDIR /app

# Instala apenas as dependências necessárias para produção
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# 3. Estágio de Build: Compila a aplicação Next.js
FROM base AS builder
WORKDIR /app

# Copia as dependências de produção do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia o restante do código-fonte
COPY . .

# Garante que todas as dependências (incluindo as de dev) estejam instaladas para o build
RUN yarn install --frozen-lockfile

# Executa o build da aplicação
RUN yarn build

# 4. Estágio Final (Runner): Cria a imagem de produção final e otimizada
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Cria um usuário e grupo não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os artefatos de build da pasta standalone, que é otimizada para produção
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
