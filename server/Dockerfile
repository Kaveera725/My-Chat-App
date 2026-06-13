# ---- Server (Express + Socket.IO) ----
FROM node:20-alpine

# Small init process so SIGTERM/SIGINT propagate correctly (clean container stops)
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Run as the built-in unprivileged user
USER node

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Lightweight container healthcheck against the status route
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/status || exit 1

CMD ["node", "server.js"]
