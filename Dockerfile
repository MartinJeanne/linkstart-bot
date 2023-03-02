FROM node:18-alpine
WORKDIR /usr/linkstart-bot

# npm
COPY package.json .
COPY package-lock.json .
RUN npm install

# Environnement variables
COPY .env .

# Code
COPY src src

# Run the bot
CMD ["npm", "start"]
