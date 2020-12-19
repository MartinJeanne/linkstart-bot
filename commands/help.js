module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    execute(message, args) {
        switch (args.length) {
            case 0:
                const data = [];
                const { commands } = message.client;

                if (!args.length) {
                    data.push('Here\'s a list of all my commands :');
                    data.push(commands.map(command => command.name).join(', '));
                    data.push(`\nYou can send \`/help <command name>\` to get info on a specific command !`);

                    return message.channel.send(data, { split: true });
                }
                break;

            case 1:
                let reply = `this is the list of the differents arguments for \`/${args[0]}\``;
                let commandName = `\n\`/${args[0]}`;
                switch (args[0]) {
                    case 'cookie':
                        message.reply(reply
                            + commandName + ' me`  give you a beautifull cookie !'
                            + commandName + ' give <amount> <user>\`  give a certain amount of cookie(s) to the mentionned user.'
                            + commandName + ' amount`  allow you to see how many cookies you have.'
                        );
                        break;

                    case 'tg':
                        message.reply(reply
                            + commandName + ' <mention>`  say something kind to the mentionned user.'
                        );
                        break;

                    case 'clear':
                        message.reply(reply
                            + commandName + ' <amount>`  remove the amount of message(s) in the channel where this command is called.'
                        );
                        break;
                    default:
                        message.reply('I don\'t know this command !\nTo view all my commands, do `/help`');
                }
                break;

            default:
                message.reply('too many arguments. Just do `/help`, or `/help <command name>`');
        }
    },
};