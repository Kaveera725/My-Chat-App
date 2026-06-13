# ---- Stage 1: build the Vite SPA ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Empty backend URL => axios/socket.io use same-origin relative paths, which the
# Nginx reverse proxy below forwards to the server. Override via build arg if you
# serve the API from a different origin.
ARG VITE_BACKEND_URL=""
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

# ---- Stage 2: serve static build with Nginx ----
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
