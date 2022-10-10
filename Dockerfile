FROM node:18-alpine3.15 AS BuildStage

# Create app directory
WORKDIR /app

# Install app dependencies
COPY *.json ./

# Copy all files to build stage
COPY . .
# install dependencies for production
RUN npm install

# building code for production
RUN npm run postinstall

# Final stage
FROM node:18-alpine3.15

# Create app directory
WORKDIR /app

# Copy build
COPY --from=BuildStage /app/node_modules/ ./node_modules/
COPY --from=BuildStage /app/dist/ .

EXPOSE 3000

CMD [ "node", "main.js" ]