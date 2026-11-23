FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci --ignore-scripts
COPY frontend frontend
ENV API_INTERNAL_URL=http://backend:4301 NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w frontend

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=4300 API_INTERNAL_URL=http://backend:4301 NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=build --chown=node:node /app/frontend/public ./frontend/public
USER node
EXPOSE 4300
CMD ["node", "frontend/server.js"]
