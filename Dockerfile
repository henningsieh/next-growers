# Gepinnter Node-Stand: 24.22.1-alpine (Oktober-2026-Sicherheitsrelease, LTS "Krypton").
# Fixiert CVE-2026-111497 (Brotli), CVE-2026-105482 (DNS NUL-Byte),
# CVE-2026-105483 / CVE-2026-106069 (TLS-IP-Normalisierung).
# Quelle: https://nodejs.org/en/blog/vulnerability/october-2026-security-releases
# Stand verifiziert am 2026-10-24 als aktuellster Node-24-LTS-Patch
# (https://nodejs.org/download/release/index.json -> v24.22.1).
# BEIDE Stufen (builder + runner) muessen denselben Pin tragen.
FROM node:24.22.1-alpine AS builder

WORKDIR /app

# pnpm kommt aus package.json ("packageManager") – das ist die
# einzige, massgebliche Vorgabe. Hier steht bewusst KEINE zweite pnpm-Version,
# damit beide nicht auseinanderlaufen koennen. corepack loest die Version
# anhand der kopierten package.json auf.
# pnpm-workspace.yaml MUSS mit kopiert werden: es enthaelt overrides +
# allowBuilds + minimumReleaseAge. Ohne sie bricht "pnpm install
# --frozen-lockfile" mit ERR_PNPM_LOCKFILE_CONFIG_MISMATCH ab.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/
RUN corepack enable && node --version && pnpm --version

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Production image – derselbe gepatchte Node-Stand wie im Builder
FROM node:24.22.1-alpine AS runner

# Install curl for Coolify healthchecks (avoids wget fallback warnings)
RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production

# Build-Nachweis: scheitert der Build, falls das Runtime-Image nicht den
# gepatchten Stand enthaelt.
RUN node --version

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/sentry.build.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/next-sitemap.config.js ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]
