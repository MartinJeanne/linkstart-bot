const cookie = require('./query/cookie');

module.exports = {
    name: 'cookie',
    description: 'Cookie !',
    args: true,
    execute(message, args) {
        switch (args[0]) {

            case 'me':
                // Give cookie to user
                cookie.me(message);
                message.channel.send(`There you go, one cookie for you ${message.author} !`);
                break;

            case 'amount':
                // Say the number of cookies user have
                var amount;
                // Compliqué, pour comprendre : https://stackoverflow.com/questions/31875621/how-to-properly-return-a-result-from-mysql-with-node
                cookie.amount(message.author, function (result) {
                    amount = result;
                    message.reply(`you have ${amount} cookie(s) !`);
                    if (amount == 0) { message.channel.send('Wtf are you doing ?\n Execute this command : `/cookie me`') }
                });
                break;

            case 'give':
                if (!message.mentions.users.size) {
                    return message.reply('you need to mention an user in order to give a cookie to them !');
                }

                mentionnedUser = message.mentions.users.first();

                if (mentionnedUser === message.author) {
                    return message.reply('you cannot give cookies to yourself ! ')
                }

                // If user doesn't specifie number, he give 1 cookie
                if (args[1] == "<@"+mentionnedUser+">" || args[1] == "<@!"+mentionnedUser+">") {
                    args[1] = 1;
                }

                var amountArg = parseInt(args[1]);

                if (isNaN(amountArg)) {
                    return message.reply('that doesn\'t seem to be a valid number.');
                }

                else if (amountArg < 1 || amountArg > 100) {
                    message.reply('the number of cookie given must be between 1 and 100 !');
                }

                else {
                    // Giver amount
                    cookie.amount(message.author, function (result) {
                        var giverAmount = result;
                        // If giver don't have enough cookies
                        if (giverAmount < amountArg) { message.reply(`you only have ${giverAmount} cookies !`); }
                        else {
                            // Receiver amount
                            var numberToSubtract = giverAmount - amountArg;
                            cookie.amount(mentionnedUser, function (result) {
                                let numberToGive = result + amountArg;
                                cookie.give(message.author, numberToSubtract, mentionnedUser, numberToGive);
                                if (amountArg === 1) { message.channel.send(`${mentionnedUser} you received a cookie from ${message.author} !`); }
                                else { message.channel.send(`${mentionnedUser} you received ${amountArg} cookies from ${message.author} !`); }
                            });
                        }
                    });
                }
                break;

            default:
                message.reply('undefined argument for `/cookie`.\n If you need help do : `/help cookie`');
        }
    },
};