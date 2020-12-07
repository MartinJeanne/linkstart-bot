const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = config.prefix

//Toutes les actions à faire quand le bot se connecte
client.once("ready", ()=>{
    console.log("En marche !");
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command) {
        case "ping" :
            message.channel.send('pong !');
    }
})

client.login(config.token)