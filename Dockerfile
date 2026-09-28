# AI-bot Dockerfile
# Multi-stage build para producción optimizada
# Uso: docker build -t library-ai-bot . && docker run -p 5175:5175 -e VITE_API_URL=https://api.tudominio.com library-ai-bot

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias de build (python, make, g++ para native modules)
RUN apk add --no-cache python3 make g++

# Copiar package files primero para aprovechar cache de Docker
COPY package*.json ./

# Instalar dependencias (incluye devDependencies para build)
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# ============================================
# Stage 2: Production (nginx static server)
# ============================================
FROM nginx:alpine AS production

# Copiar build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 5175

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5175/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]