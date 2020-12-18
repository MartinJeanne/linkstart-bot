const cookie = require('./query/cookie');

module.exports = {
    name: 'cookie',
    description: 'Cookie !',
    guildOnly: true,
    args: true,
    cooldown: 5,

    execute(message, args) {
        switch (args.length) {
            case 1:
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

                    default:
                        throw "Unknow argument";
                }
                break;

            case 2:
                switch (args[0]) {
                    case 'give':
                        if (!message.mentions.users.size) {
                            return message.reply('you need to mention an user in order to give a cookie to them !');
                        }

                        mentionnedUser = message.mentions.users.first();
                        if (mentionnedUser === message.author) {
                            return message.reply(`you cannot give cookie to yourself !`)
                        }

                        else { giveCookies(1); }
                        break;

                    default:
                        throw "Unknow argument";
                }
                break;
            case 3:
                switch (args[0]) {
                    case 'give':
                        if (!message.mentions.users.size) {
                            return message.reply('you need to mention an user in order to give a cookie to them !');
                        }

                        mentionnedUser = message.mentions.users.first();
                        if (mentionnedUser === message.author) {
                            return message.reply(`you cannot give cookie to yourself !`)
                        }

                        var amountToGive = parseInt(args[1])
                        if (isNaN(amountToGive)) {
                            return message.reply('that doesn\'t seem to be a valid number.');
                        }

                        else if (amountToGive < 1 || amountToGive > 100) {
                            message.reply('the number of cookie given must be between 1 and 100 !');
                        }

                        else { giveCookies(amountToGive); }
                        break;

                    default:
                        throw "Unknow argument";
                }
                break;

            default:
                throw "Wrong argument length";
        }

        function giveCookies(amountToGive) {
            // Giver amount
            cookie.amount(message.author, function (result) {
                var giverAmount = result;
                // If giver don't have enough cookies
                if (giverAmount < amountToGive) { message.reply(`you only have ${giverAmount} cookies !`); }
                else {
                    // Receiver amount
                    var numberToSubtract = giverAmount - amountToGive;
                    cookie.amount(mentionnedUser, function (result) {
                        let numberToGive = result + amountToGive;
                        cookie.give(message.author, numberToSubtract, mentionnedUser, numberToGive);
                        if (amountToGive === 1) { message.channel.send(`${mentionnedUser} you received a cookie from ${message.author} !`); }
                        else { message.channel.send(`${mentionnedUser} you received ${amountToGive} cookies from ${message.author} !`); }
                    });
                }
            });
        }
    },
};