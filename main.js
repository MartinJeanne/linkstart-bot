const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

//Toutes les actions à faire quand le bot se connecte
client.once("ready", ()=>{
    console.log("En marche !");
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    switch(command) {
        case "ping" :
            message.channel.send('pong !');
            break;

        case "cookie" :
            message.channel.send('Cookie');
            break

        case 'args-info' :
            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    }
})

client.login(token)