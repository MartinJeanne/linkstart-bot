# linkstart-bot
## Info
French discord bot that can play music among other things!  
[Invite Linkstart-bot](https://discord.com/oauth2/authorize?client_id=784536536459771925&permissions=8&scope=bot) on your server 🤖
This project take advange of CI/CD and automatically deploy any commit pushed on master via Docker on a VPS.

## Run the bot
Rename .env.example file in .env and fill these information:

```env
DISCORD_CLIENT_ID=your_application_id
DISCORD_TOKEN=the_token_of_your_bot
```

### Run bot with Node.js
Install dependencies:

```bash
npm install
```

Lauch the bot:

```bash
npm start
```

### Run bot with Docker
Build Docker image:

```bash
docker build -t linkstart-bot .
```

Run image in a container:

```bash
docker run linkstart-bot
```
