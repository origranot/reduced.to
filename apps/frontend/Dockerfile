# --------------------------------------------
# Dependencies Stage
# --------------------------------------------
FROM node:19.2-alpine3.15 as dependencies
WORKDIR /app

COPY package*.json ./

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

RUN npm ci

# --------------------------------------------
# Build Stage
# --------------------------------------------
# Intermediate docker image to build the bundle in and install dependencies
FROM node:19.2-alpine3.15 as build

# Arguments passed from docker-compose.yml / workflow
ARG API_DOMAIN
ARG CLIENTSIDE_API_DOMAIN
ARG DOMAIN

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# Run prisma generate & build the bundle in production mode
RUN npx nx build frontend --prod --skip-nx-cache

# --------------------------------------------
# Production Stage
# --------------------------------------------
FROM node:19.2-alpine3.15 as production
WORKDIR /app

COPY --from=build /app/dist/apps/frontend ./frontend
COPY --from=build /app/node_modules ./node_modules

EXPOSE 5000

# Start the application
CMD [ "node", "frontend/server/entry.express.js"]






