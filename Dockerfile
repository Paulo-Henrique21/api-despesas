# ---- Base: Node LTS (alpine) ----
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia apenas os manifests primeiro (melhor cache)
COPY package*.json ./

# Instala dependências de produção
# Use uma das opções conforme sua versão do npm:
# npm v10+:         npm ci --omit=dev
# npm v8/v9 (ok):   npm ci --only=production
RUN npm ci --omit=dev

# Copia o código da aplicação
COPY src/ ./src/

# Cria usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs \
  && adduser -S appuser -u 1001 \
  && chown -R appuser:nodejs /app

USER appuser

# Porta (documentação; o Render injeta PORT em runtime)
ENV PORT=8000
EXPOSE 8000

# Healthcheck (ajuste a rota se usar outra)
# Alpine já possui wget (busybox). Se preferir curl, instale com: apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

# Comando de start (seu server deve usar process.env.PORT e bind 0.0.0.0)
CMD ["node", "src/server.js"]
