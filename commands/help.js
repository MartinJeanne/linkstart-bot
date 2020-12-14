const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands :');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command]\` to get info on a specific command !`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands !');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you !');
                });
        }
        switch (args[0]) {
            case 'cookie':
                message.channel.send(`${message.author}, this is the list of the differents arguments for \`/cookie\``
                    + '\n\`/cookie me\`  give you a beautifull cookie !'
                    + '\n\`/cookie give <amount> <user>\`  give a certain amount of cookie(s) to the mentionned user.'
                    + '\n\`/cookie amount\`  allow you to see how many cookies you have.'
                );
                break;
        }
    },
};