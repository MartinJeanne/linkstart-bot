FROM node:18
WORKDIR /usr/src/linkstart-bot

# dependencies installation
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Environnement variables
COPY .env .

# Code
COPY src src

# Run the bot
CMD ["npm", "start"]
