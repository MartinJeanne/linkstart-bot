
const fs = require('fs'); // Allow JS to navigate into files
const Discord = require('discord.js'); // The discord API
const { token } = require('./config.json'); // LOCAL ONLY : Get token from config.js
const prefix = '/';

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection(); // To add cooldown on certain command


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log("En marche !");
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; // If message do not start with the bot prefix, or if message if from a bot

    const args = message.content.slice(prefix.length).trim().split(/ +/); // The argument(s) of the command, saved in an array
    const commandCalled = args.shift().toLowerCase(); // The command

    if (!client.commands.has(commandCalled)) return; // Si la commande ne correspond à aucun fichier, on return
    const command = client.commands.get(commandCalled); // si elle existe, on return le fichier js portant le nom de la commande

    // Check if command only usable in server (guild)
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs !');
    }

    // Check if command need argument(s)
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments ${message.author} ! ${helpAndUsage(command)}`;
        return message.channel.send(reply);
    }

    // Check if comment is on cooldown
    if (!onCooldown(cooldowns, command, message)) {
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            let reply = `there was an error with that command ! ${helpAndUsage(command)}`;
            message.reply(reply);
        }
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'crash-test');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'crash-test');
    if (!channel) return;
    channel.send(`Bye, ${member}`);
});

client.login(token); // LOCAL
//client.login(process.env.BOT_TOKEN); // ONLINE : process.env.BOT_TOKEN is a heroku variable


function onCooldown(cooldowns, command, message) {
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
            message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            return true;
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
}

function helpAndUsage(command) {
    let reply
    if (command.usage) {
        reply = `\nThe proper usage would be : \`${prefix + command.name} ${command.usage}\``;
    }
    else {
        reply = `\nGet some help by doing : \`${prefix}help ${command.name}\``;
    }
    return reply;
}