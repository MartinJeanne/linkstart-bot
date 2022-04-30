const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Tell a Chuck Norris fact!')
		.addStringOption(option => option.setName('fullname')
				.setDescription('Enter your firstname and lastname, separated by a space')
				.setRequired(false)),
	async execute(interaction) {
		let name = interaction.options.getString('fullname');
		let requestArg = ''
		if (name) {
			let arr = name.split(' ');
			requestArg = `?firstName=${arr[0]}&lastName=${arr[1]}`
		}
		
		let myjoke;
		await axios.get('http://api.icndb.com/jokes/random' + requestArg)
			.then(response => {
				myjoke = response.data;
			})
			.catch(error => console.log(error));
		await interaction.reply(myjoke.value.joke);
	},
};