module.exports = {
	name: 'tg',
	description: 'Mute someone',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('personne n\'est mentionné.');
		}

		mentionnedUser = message.mentions.users.first();
		
		if (mentionnedUser === message.author) {
			return message.reply('heuu, t\'es chelou en vrai fréro.')
		}

		else if (mentionnedUser == '784536536459771925') {
			return message.reply('tu t\'es pris pour qui ? J\'vais te goumer.');
		}

		else if (args[0] == "<@"+mentionnedUser+">" || args[0] == "<@!"+mentionnedUser+">") {
			message.channel.send(`${mentionnedUser}, je crois qu'il faut que tu te taises.`)
		}

		else {
			return message.reply('pas bien compris là.\nFais comme ça : `/tg <mention>`.');
		}
	},
};

