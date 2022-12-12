# Linkstart-bot
Discord bot to train JS and discord API !

## Add your bot token
Create "ressources/config.json" with these information:
```json
{
    "clientId": "your_application_id",
    "guildId": "your_discord_server_id",
    "token": "the_token_of_your_bot"
}
```

## Run with Docker
### Build Docker image
    docker build -t linkstart-bot .

### Run bot image
    docker run linkstart-bot

## Run manually
#### Install packages
    npm install


#### Execute main file
    node main.js
    
## Invite my bot : 
- Invite it on your server by this link : 
>https://discord.com/oauth2/authorize?client_id=784536536459771925&permissions=8&scope=bot

**Have fun !**
