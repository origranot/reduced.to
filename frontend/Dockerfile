FROM node:18-alpine3.15 AS BuildStage

# Create app directory
WORKDIR /app

# Install app dependencies
COPY *.json ./

# Copy all files to build stage
COPY . .

# Install dependencies for production
RUN npm install

# Building code for production
RUN npm run build

# Build static files
RUN npm run build.server

# Final stage
FROM node:18-alpine3.15

# Create app directory
WORKDIR /app

# Copy build
COPY --from=BuildStage /app/node_modules/ ./node_modules/
COPY --from=BuildStage /app/dist/ ./dist/
COPY --from=BuildStage /app/server/ ./server/

EXPOSE 5000

CMD [ "node", "server/entry.express.js" ]