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
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

# Run prisma generate & build the bundle in production mode
RUN npx nx build backend --prod --skip-nx-cache


# --------------------------------------------
# Production Stage
# --------------------------------------------
FROM node:19.2-alpine3.15 as production
WORKDIR /app

COPY --from=build /app/dist/apps/backend ./backend
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/libs/ ./libs

EXPOSE 3000

# Start the application
CMD sh -c "npx nx migrate-deploy prisma && node backend/main.js"







