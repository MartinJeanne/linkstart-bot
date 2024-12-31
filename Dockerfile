## Build step
FROM node:22.2 AS build
WORKDIR /app

# install packages
COPY ["package.json", "package-lock.json", "./"]
RUN npm install

# compile code to JS
COPY tsconfig.json .
COPY src src
RUN npm run build


## Where the app actually runs
FROM node:22.2
WORKDIR /app

# install ffmpeg for audio processing
RUN apt-get update && apt-get install -y ffmpeg

# create empty folder to store musics
RUN mkdir /app/music-files

# copy env var and code from build
COPY .env .
COPY --from=build /app/dist ./dist

COPY ["package.json", "package-lock.json", "./"]
RUN npm install --omit=dev

CMD ["npm", "start"]
