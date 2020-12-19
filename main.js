const fs = require('fs'); // Allow JS to navigate into files
const Discord = require('discord.js'); // The discord API
const { token } = require('./ressources/config.json'); // LOCAL
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
    const commandCalled = args.shift().toLowerCase(); // The name of command

    if (!client.commands.has(commandCalled)) return; // Check if the name of the command correspond to a js file
    const command = client.commands.get(commandCalled);

    // Check if command only usable in server (guild)
    if (command.guildOnly && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs !');

    // Check if command need permission
    if (command.permission && !message.member.hasPermission(command.permission)) return message.reply('you don\'t have the permission to use this command !');

    // Check if command need argument(s)
    if (command.args && !args.length) return message.channel.send(`You didn't provide any arguments ${message.author} ! ${helpAndUsage(command)}`);

    if (onCooldown(cooldowns, command, message)) return; // Check if command is on cooldown

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        let reply = `there was an error with that command ! ${helpAndUsage(command)}`;
        message.reply(reply);
    }

});

client.on('guildMemberAdd', member => {
    member.roles.add('485021407529664526');
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
    if (!channel) return;
    channel.send(`Bye, ${member}`);
});

client.login(token); // process.env.TOKEN (REMOTE)

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