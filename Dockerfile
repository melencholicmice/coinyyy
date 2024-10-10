# Base and Dependency Stage
FROM node:18-alpine AS base

RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build Stage
FROM base AS build

COPY . .
RUN pnpm run build

# Production Stage
FROM node:18-alpine

RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

RUN adduser -D appuser
USER appuser

EXPOSE 3000

CMD ["node", "dist/index.js"]
