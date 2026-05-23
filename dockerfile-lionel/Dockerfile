# ─── Stage 1: Build ───────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias primero (mejor cache)
COPY my-app/package*.json ./

# Instalar dependencias con cache optimizado
RUN npm ci --legacy-peer-deps --no-audit --prefer-offline

# Copiar el resto del código
COPY my-app/ .

# Build de producción (SSR incluido) con mejor manejo de memoria
RUN node --max-old-space-size=4096 node_modules/@angular/cli/bin/ng.js build --configuration production

# ─── Stage 2: Runtime ─────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Solo copiar el output del build
COPY --from=builder /app/dist/my-app ./dist/my-app

EXPOSE 4000

CMD ["node", "dist/my-app/server/server.mjs"]
