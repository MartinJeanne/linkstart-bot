# linkstart-bot
French discord bot that can play music and do many things!

## Run the bot
Modify "ressources/config.json" and fill these information:
```json
{
    "clientId": "your_application_id",
    "guildId": "your_discord_server_id",
    "token": "the_token_of_your_bot"
}
```

### Run bot with Node.js
Deploy command to Discord
```
node deploy-commands.js
```
Launch the bot
```
node main.js
```

### Run bot with Docker
Build Docker image:
```
docker build -t linkstart-bot .
```

Run image in a container:
```
docker run linkstart-bot
```
    
## Invite my bot : 
Invite it on your server by this link: 
>https://discord.com/oauth2/authorize?client_id=784536536459771925&permissions=8&scope=bot

**Have fun !**
