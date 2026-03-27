# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables to fix the Google Font connection error
ENV NEXT_FONT_GOOGLE_MOCKED=1
ENV NEXT_TELEMETRY_DISABLED=1
# Set the Backend API URL for the build process
ENV NEXT_PUBLIC_API_URL=http://backend:8000

# Run build only ONCE
RUN npm run build

# --- Stage 3: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Disabling telemetry in runner as well
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what is strictly necessary for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]