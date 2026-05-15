# Dockerfile for the ground-control fork of allmaps Editor.
# Single-stage build: install monorepo deps, build workspace packages, build
# the editor app, then run the SvelteKit adapter-node server.

FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy everything. The monorepo's workspace package builds need the full
# source graph; we can prune unused apps later if image size becomes an issue.
COPY . .

RUN pnpm install --recursive --frozen-lockfile=false
RUN pnpm run build:packages
RUN pnpm --filter @allmaps/editor run build

# ---- runtime ----
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# adapter-node respects $PORT; Railway injects it at runtime.
EXPOSE 3000

# We need the editor build output plus the workspace's node_modules layout
# since adapter-node's compiled server still resolves @allmaps/* via symlinks.
COPY --from=builder /app /app

WORKDIR /app/apps/editor

CMD ["node", "build"]
