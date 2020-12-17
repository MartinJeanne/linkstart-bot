// Allow JS to navigate into files
const fs = require('fs');
// The discord API
const Discord = require('discord.js');
// Get token and prefix from config.js
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

// To add cooldown on certain command
const cooldowns = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// TODO : Expot the bot online and make it replace the mee6 bot !!!

//Toutes les actions à faire quand le bot se connecte
client.once("ready", () => {
    console.log("En marche !");
});

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'crash-test');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);
});

client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'crash-test');
    if (!channel) return;
    channel.send(`Bye, ${member}`);
});


client.on('message', message => {
    // If message do not start with the bot prefix, or if message if from a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // The argument(s) of the command, saved in a array
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // The command
    const commandName = args.shift().toLowerCase();

    // Si la commande ne correspond à aucun fichier, on return
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    // For command only usable in server (guild)
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs !');
    }

    // Check if command need argument
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

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command !');
    }
})

client.login(process.env.BOT_TOKEN); //BOT_TOKEN is the Client Secret