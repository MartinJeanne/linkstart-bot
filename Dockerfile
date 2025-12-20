## Build step
FROM node:22.2 AS build
WORKDIR /app

# Install packages
COPY package.json package-lock.json ./
RUN npm ci

# Compile code to JS
COPY tsconfig.json ./
COPY src ./src
RUN npm run build


## Where the app actually runs
FROM node:22.2
WORKDIR /app

# Install ffmpeg for audio processing
RUN apt-get update && apt-get install -y ffmpeg

# Install yt-dlp to download music
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
 && chmod +x /usr/local/bin/yt-dlp


COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Create empty folder to store musics
RUN mkdir /app/music-files

CMD ["npm", "start"]
