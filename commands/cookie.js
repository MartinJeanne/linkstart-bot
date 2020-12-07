module.exports = {
	name: 'cookie',
	description: 'Cookie !',
	execute(message, args) {
        // Arg if the user want to give cookie to someone
        if (args[0] === 'give') {
            if (!message.mentions.users.size) {
                return message.reply('you need to mention an user in order to give a cookie to them !');
            }
            // The user give a certain amount of cooki
            if (args[2] != null) {
                const amount = parseInt(args[2]);
                if (isNaN(amount)) {
                    return message.reply('that doesn\'t seem to be a valid number.');
                }
                else if (amount < 2 || amount > 100) {
                    message.reply('the number of cookie given must be between 2 and 100 !')
                }
                else {
                    message.channel.send(message.mentions.users.first().username + ', you received ' + amount + ' cookies from ' + message.author.username + ' !')
                }
            }
            else {
                message.channel.send(message.mentions.users.first().username + ', you received a cookie from ' + message.author.username + ' !')
            }
        }

        // No arg, the user receive a cookie !
        else {
            message.channel.send('There you go, one cookie for you ' + message.author.username);
        }
	},
};