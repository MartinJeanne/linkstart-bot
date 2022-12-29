FROM node:16-alpine
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY commands commands
COPY .env .

# Run the bot
COPY deploy-commands.js .
COPY index.js .
CMD ["npm", "start"]
