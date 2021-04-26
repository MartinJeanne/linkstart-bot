module.exports = {
	name: 'tg',
	description: 'Say a good word to someone',
	guildOnly: true,
	args: true,
	usage: '<mention>',

	execute(message, args) {
		switch (args.length) {
			case 1:
				if (!message.mentions.users.size) {
					return message.reply('personne n\'est mentionné.');
				}

				mentionnedUser = message.mentions.users.first();

				if (mentionnedUser === message.author) {
					return message.reply('heuu, t\'es chelou en vrai fréro.');
				}

				else if (mentionnedUser == '784536536459771925') {
					return message.reply('tu t\'es pris pour qui ? J\'vais te goumer.');
				}

				else if (mentionnedUser == '306129521990565888') {
					return message.reply('tu es sûr de vouloir faire ça ?');
				}
				
				else {
					message.channel.send(`${mentionnedUser}, je crois qu'il faut que tu te taises.`);
				}
				break;

			default:
				throw "Wrong argument length";
		}
	},
};

