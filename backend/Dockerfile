FROM node:18 AS build

# Required for Prisma Client to work in container
RUN apt-get update && apt-get install -y openssl

WORKDIR /svr/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/


# Install npm dependencies
RUN npm ci

COPY --chown=node:node . .

# Generate prisma files
RUN npx prisma generate

# Install argon2 from source
RUN apk add build-base git \
    && git clone https://github.com/P-H-C/phc-winner-argon2.git \
    && cd phc-winner-argon2 \
    && make \
    && make install \
    && cd .. \
    && rm -rf phc-winner-argon2 \
    && apk del build-base git

# Add argon2 binary to PATH environment variable
ENV PATH="/usr/local/bin:${PATH}"

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

FROM node:18-alpine3.16 AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /svr/app/node_modules ./node_modules
COPY --chown=node:node --from=build /svr/app/dist ./dist
COPY --chown=node:node --from=build /svr/app/package*.json ./
COPY --chown=node:node --from=build /svr/app/prisma ./prisma

EXPOSE 3000

# Start the server using the production build
CMD [ "npm", "run", "start:migrate:prod" ]
