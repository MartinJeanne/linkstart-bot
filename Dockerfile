## Build step
FROM node:22.2 AS build
WORKDIR /src

# install packages
COPY ["package.json", "package-lock.json", "./"]
RUN npm install

# compile code to JS
COPY src src
RUN npm run build


## Where the app actually runs
FROM node:22.2
WORKDIR /src

# install ffmpeg for audio processing
RUN apt-get update && apt-get install -y ffmpeg

# Copy env var and code from build
COPY .env .
COPY --from=build /src/dist ./dist

COPY ["package.json", "package-lock.json", "./"]
RUN npm install --omit=dev

CMD npm start
