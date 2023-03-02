FROM node:18-alpine
WORKDIR /usr/linkstart-bot

# npm
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production

# Environnement variables
COPY .env .

# Code
COPY src src

# Run the bot
CMD ["npm", "start"]
