// JSON data file

module.exports = {
    name: 'cookie',
    description: 'Cookie !',
    args: true,
    execute(message, args) {
        switch (args[0]) {

            case 'me':
                //give cookie to user
                message.channel.send(`There you go, one cookie for you ${message.author} !`);
                break;

            case 'give':
                if (!message.mentions.users.size) {
                    return message.reply('you need to mention an user in order to give a cookie to them !');
                }
                
                mentionnedUser = message.mentions.users.first();

                if (mentionnedUser === message.author) {
                    return message.reply('you cannot give cookie to yourself ! ' + len)
                }

                const argMentionId = getIdFromMention(args[1]);
                const argAmount = parseInt(args[1])

                // The user give a cookie
                if (argMentionId === mentionnedUser.id || argAmount === 1) {
                    return message.channel.send(`${mentionnedUser} you received a cookie from ${message.author} !`)
                }

                else if (isNaN(argAmount)) {
                    return message.reply('that doesn\'t seem to be a valid number.');
                }

                else if (argAmount < 1 || argAmount > 100) {
                    message.reply('the number of cookie given must be between 1 and 100 !');
                }

                else {
                    message.channel.send(`${mentionnedUser} you received ${argAmount} cookies from ${message.author} !`);
                }
        }

        function getIdFromMention(mention) {
            if (!mention) return;

            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);

                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }

                return mention;
            }
        }
    },
};