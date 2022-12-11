FROM node:16-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY commands commands
COPY ressources/config.json ressources/config.json
COPY main.js .

CMD ["node", "main.js"]