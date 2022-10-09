FROM node:18-alpine3.15 AS BuildStage

# Create app directory
WORKDIR /app

# Install app dependencies
COPY *.json ./

# install dependencies for production
RUN npm ci --omit=dev

# Copy all files to build stage
COPY . .

# building code for production
RUN npm run postinstall

# Final stage
FROM node:18-alpine3.15

# Create app directory
WORKDIR /app

# Copy build
COPY --from=BuildStage /app/node_modules/ ./node_modules/
COPY --from=BuildStage /app/views ./views/
COPY --from=BuildStage /app/dist/ ./dist/
COPY --from=BuildStage /app/public/ ./public/

EXPOSE 3000

CMD [ "node", "dist/main.js" ]