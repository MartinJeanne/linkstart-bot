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
			if (arr.length == 2) requestArg = `?firstName=${arr[0]}&lastName=${arr[1]}`
			else return await interaction.reply({ content: 'The fullname you provided is incorrect, it must me like a firstname followed by a lastname with a space between. Example: "Chuck Norris".', ephemeral: true });
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