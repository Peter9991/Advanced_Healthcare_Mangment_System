# Multi-stage Dockerfile for Node.js + TypeScript backend

# ===== Builder stage =====
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ===== Runtime stage =====
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy built app
COPY --from=builder /app/dist ./dist

# Expose app port (default 5000)
EXPOSE 5000

# Default environment variables (override in run)
ENV PORT=5000

# Start the server
CMD ["node", "dist/server.js"]
