# linkstart-bot
Discord bot i did to train JS, API and Docker !

## Run bot with Docker
### Add bot information
Create "ressources/config.json" with these information:
```json
{
    "clientId": "your_application_id",
    "guildId": "your_discord_server_id",
    "token": "the_token_of_your_bot"
}
```
### Build Docker image
    docker build -t linkstart-bot .

### Run bot
    docker run linkstart-bot
    
## Invite my bot : 
- Invite it on your server by this link : 
>https://discord.com/oauth2/authorize?client_id=784536536459771925&permissions=8&scope=bot

**Have fun !**
