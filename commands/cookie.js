module.exports = {
    name: 'cookie',
    description: 'Cookie !',
    args: true,
    //usage: '<user> <amount>',
    help: true,
    execute(message, args) {
        switch (args[0]) {
            case 'help':
                message.reply('there is a list of the differents arguments for \`/cookie\`'
                    + '\n\`/cookie me\`  give you a beautifull cookie !'
                    + '\n\`/cookie give <amount> <user>\`  give a certain amount of cookie(s) to the mentionned user !'
                    + '\n\`/cookie help\`  to show this help message.'
                )
                break

            case 'me':
                //give cookie to user
                message.channel.send(`There you, one cookie for you ${message.author.username} !`);
                break;

            case 'give':
                if (!message.mentions.users.size) {
                    return message.reply('you need to mention an user in order to give a cookie to them !');
                }

                // TODO : revoir le code pour le mentionned user, utiliser son id pour la vérification ou autre ? (voir doc)
                mentionnedUser = message.mentions.users.first();
                const argMentionId = getIdFromMention(args[1]);
                const argAmount = parseInt(args[1])

                // The user give a cookie
                if (argMentionId === mentionnedUser.id || argAmount === 1) {
                    return message.channel.send(`${mentionnedUser} you received a cookie from ${message.author.username} !`)
                }

                else if (isNaN(argAmount)) {
                    return message.reply('that doesn\'t seem to be a valid number.');
                }

                else if (argAmount < 1 || argAmount > 100) {
                    message.reply('the number of cookie given must be between 1 and 100 !');
                }

                else {
                    message.channel.send(`${mentionnedUser} you received ${argAmount} cookies from ${message.author.username} !`);
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