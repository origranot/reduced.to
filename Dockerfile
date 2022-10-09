FROM node:18-alpine3.15

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# If you are building your code for production
# RUN yarn install --frozen-lockfile
RUN yarn

# Bundle app source
COPY . .


EXPOSE 3000

CMD [ "yarn", "start" ]