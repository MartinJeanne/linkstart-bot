// Allow JS to navigate into files
const fs = require('fs');
// The discord API
const Discord = require('discord.js');
// Get token and prefix from config.js
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Toutes les actions à faire quand le bot se connecte
client.once("ready", () => {
    console.log("En marche !");
});

client.on('message', message => {
    // Si le message ne commence pas par le prefix ou est un message d'un bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // args : les agurments après la commande (tableau)
    // commandName : le nom de la commande
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Si la commande ne correspond à aucun fichier, on return
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments ${message.author} !`;
        if (command.usage) {
            reply += `\nThe proper usage would be : \`${prefix + command.name} ${command.usage}\``;
        }
        if (command.help) {
            reply += `\nGet some help by doing : \`${prefix + command.name} help\``;
        }
        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        let reply = 'there was an error trying to execute that command !';
        message.reply(reply);
    }
})

client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret