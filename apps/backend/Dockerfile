FROM node:22-alpine3.20 as dependencies
WORKDIR /app

# Install Python for node-gyp
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

# Build Stage
FROM node:22-alpine3.20 as build
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# Run prisma generate & build the bundle in production mode
RUN npx nx build backend --prod --skip-nx-cache

# Production Stage
FROM node:22-alpine3.20 as production
WORKDIR /app

COPY --from=build /app/dist/apps/backend ./backend
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/libs/prisma ./libs/prisma

EXPOSE 3000

CMD sh -c "npx nx migrate-deploy prisma && node backend/main.js"
