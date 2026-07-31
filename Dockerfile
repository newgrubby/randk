# ============================================================
# RandK Center — production-образ
#
# Многоступенчатая сборка: в финальный образ попадает только
# standalone-вывод Next.js (~150 MB вместо ~1.5 GB с node_modules).
#
# Сборка:  docker build -t randk-center .
# Запуск:  docker run -p 3000:3000 --env-file .env.production randk-center
# ============================================================

# --- 1. Зависимости ----------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Сначала только манифесты — слой с npm ci кэшируется,
# пока package-lock.json не изменился.
COPY package.json package-lock.json ./
RUN npm ci


# --- 2. Сборка ---------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* попадают в клиентский бандл на этапе сборки,
# поэтому передаются как build-args, а не только как runtime-env.
ARG NEXT_PUBLIC_SITE_URL=https://randkcenter.ru
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build


# --- 3. Запуск ---------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Непривилегированный пользователь
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# public и .next/static не входят в standalone — копируем отдельно
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
