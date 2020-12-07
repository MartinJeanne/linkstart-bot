const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

//Toutes les actions à faire quand le bot se connecte
client.once("ready", ()=>{
    console.log("En marche !");
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'cookie') {

        if (args[0] === 'give') {

            if (!message.mentions.users.size) {
                return message.reply('you need to tag a user in order to give a cookie to them !');
            }

            if (args[1] != null) {
                const amount = parseInt(args[1]);
            
                if (isNaN(amount)) {
                    return message.reply('that doesn\'t seem to be a valid number.');
                }

                else if (amount < 2 || amount > 100) {
                    message.reply('the number of cookie given must be between 2 and 100 !')
                }

                else {
                    message.channel.send(message.mentions.users.first().username + ' you received ' + amount + ' cookie from ' + message.author.username + ' !')
                }
            }
            else {
                message.channel.send(message.mentions.users.first().username + ' you received a cookie from ' + message.author.username + ' !')
            }

        }
        else {
            message.channel.send('i give you a cookie ' + message.author.username);
        }
    }



    else if (command === 'ping') {
        message.channel.send('pong !');
    }
    else if (command === 'args-info') {
            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            message.channel.send(`Command name: ${command}\nArguments: ${args}`);
        }
})

client.login(token)