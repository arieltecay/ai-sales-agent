# Library System - AI Bot

Widget de chat inteligente para negocios. Frontend en React 19 + Vite + Tailwind CSS v4.

<!-- validando auto-deploy -->

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con VITE_API_URL=http://localhost:3000

# Desarrollo
npm run dev          # Puerto 5175

# Build producción
npm run build        # Output en dist/

# Preview build
npm run preview

# Tests
npm run test:run

# Lint + Typecheck
npm run lint
npm run typecheck
```

## 📦 Deploy a Producción

### Opción A: Vercel (Recomendado)

1. Conectar repo en Vercel
2. Configurar:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: Vite
3. Variables de entorno en Vercel Dashboard:
   ```
   VITE_API_URL=https://api.tudominio.com
   ```
4. Deploy automático en push a `master`

### Opción B: Netlify

1. Conectar repo en Netlify
2. Build settings se leen de `netlify.toml`
3. Variables de entorno en Site settings > Environment variables

### Opción C: Docker (Railway, Render, Fly.io, Coolify)

```bash
# Build local
docker build -t library-ai-bot .

# Run local
docker run -p 5175:5175 -e VITE_API_URL=https://api.tudominio.com library-ai-bot

# En plataforma: configurar variable VITE_API_URL
```

### Opción D: VPS con nginx

```bash
# En servidor
npm run build
# Copiar dist/ a /var/www/ai-bot
# Configurar nginx con proxy_pass al backend API
```

## 🔧 Variables de Entorno

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `VITE_API_URL` | ✅ | URL del backend API | `https://api.tudominio.com` |

## 🏗️ Arquitectura

```
AI-bot (Frontend)          Backend API
    │                           │
    ├── GET /ai/config     ───► │ Config del negocio + botKey
    ├── GET /ai/history    ───► │ Historial de conversación
    └── POST /ai/chat (SSE) ──► │ Stream de respuesta (tool_call, text, done)
```

## 🔑 Configuración del Bot

El bot se configura desde el panel admin o via script:

```bash
# En el backend API
cd ../api
npm run setup:bot -- <slug> [whatsappNumber]
# Ejemplo: npm run setup:bot -- libreria 549112345678
```

Retorna `botKey` y URL: `https://bot.tudominio.com/b/<slug>?key=<botKey>`

## 🧪 Testing

```bash
# Unit + Integration tests
npm run test:run

# Con UI
npm run test:ui

# Coverage
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
src/
├── api/bot/           # Cliente API (fetch + SSE parser)
├── components/        # Componentes UI reutilizables
├── hooks/             # Custom hooks (useChat, useShop, useCart, etc.)
├── lib/               # Utilidades (session, etc.)
├── pages/chat/        # Página principal del chat
│   └── components/    # ChatThread, ChatDock, OrderSection, etc.
├── index.css          # Tailwind v4 + theme tokens
├── main.tsx           # Entry point
└── App.tsx            # Router
```

## 🛠️ Stack Tecnológico

- **React 19** + **TypeScript**
- **Vite 6** (build + dev server)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **React Router 7** (routing)
- **Vitest** + **Testing Library** (tests)
- **ESLint** + **Prettier** (linting/formatting)

## 🔒 Seguridad

- Rate limiting por IP + slug (backend)
- Validación timing-safe de `botKey` (backend)
- CORS configurado para orígenes permitidos
- Headers de seguridad en nginx/Vercel/Netlify

## 📊 Monitoreo

- Backend expone `GET /health`
- Logs estructurados con Winston
- Métricas de uso LLM en `LlmUsageLog`

## 🤝 Contribuir

1. Fork + branch feature
2. `npm run lint && npm run typecheck && npm run test:run`
3. PR con descripción clara

## 📄 Licencia

Privado - Library System