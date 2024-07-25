FROM node:20.15.1-alpine3.20 as dependencies
WORKDIR /app

# Install Python for node-gyp
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

# Build Stage
FROM node:20.15.1-alpine3.20 as build
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN npx nx build tracker --prod --skip-nx-cache \
    && npm prune --production

# Production Stage
FROM node:20.15.1-alpine3.20 as production
WORKDIR /app

COPY --from=build /app/dist/apps/tracker ./tracker
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3001

CMD ["node", "tracker/main.js"]
