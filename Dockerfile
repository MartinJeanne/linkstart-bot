FROM node:16-alpine
WORKDIR /usr/linkstart-bot

# npm
COPY package.json .
COPY package-lock.json .
RUN npm install

# Environnement variables
COPY .env .

# Code
COPY src .

# Run the bot
CMD ["npm", "start"]
