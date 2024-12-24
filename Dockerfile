FROM node:21.7
WORKDIR /usr/src/linkstart-bot

RUN apt-get update && apt-get install -y ffmpeg

# Dependencies installation
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Environnement variables
COPY .env .

# Code
COPY src src

# Musics saved
COPY music-files music-files

# Run the bot
CMD ["npm", "start"]
