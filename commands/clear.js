const cookie = require('./query/cookie');

module.exports = {
    name: 'clear',
    description: 'Clear message(s)',
    guildOnly: true,
    args: true,
    usage: '<amount>',

    execute(message, args) {
        switch (args.length) {
            case 1:
                var amountToRemove = parseInt(args[0]);
                if (isNaN(amountToRemove)) {
                    return message.reply('that doesn\'t seem to be a valid number.');
                }

                else if (amountToRemove < 1 || amountToRemove > 100) {
                    message.reply('the number of message(s) to delete must be between 1 and 100.');
                }
                else {
                    message.channel.bulkDelete(amountToRemove + 1, true);
                }
                break;
            default:
                throw "Wrong argument length";
        }
    },
};