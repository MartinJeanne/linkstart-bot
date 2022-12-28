FROM node:16-alpine
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY commands commands
COPY .env .

# Deploy the commands
COPY deploy-commands.js .
RUN node deploy-commands.js

# Run the bot
COPY main.js .
CMD ["node", "main.js"]
