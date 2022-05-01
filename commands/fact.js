const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Tell a Chuck Norris fact!')
		.addStringOption(option => option.setName('firstname')
			.setDescription('Put your firstname in the fact')
			.setRequired(false))
		.addStringOption(option => option.setName('lastname')
			.setDescription('Put your lastname in the fact')
			.setRequired(false)),

	async execute(interaction) {
		let firstname = interaction.options.getString('firstname');
		let lastname = interaction.options.getString('lastname');

		let requestArg = '';
		if (firstname) {
			requestArg = '?firstName=' + firstname;
			if (lastname) requestArg =+ '&lastName=' + lastname;
		}
		else if (lastname) requestArg = '?firstName=Chuck&lastName=' + lastname;

		let data;
		await axios.get('http://api.icndb.com/jokes/random' + requestArg)
			.then(response => {
				data = response.data;
			})
			.catch(error => console.log(error));
		await interaction.reply(data.value.joke);
	},
};