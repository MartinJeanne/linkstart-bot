/*
Lukian voulait codder une méthode "jig", qui permet de dériver une adresse (de la changer un petit peu).
Cela lui permet de commander plusieurs fois des sneakers avec la même adresse.
Sans ça on ne peut pas commander plusieurs fois avec la même adresse.
*/

module.exports = {
	name: 'jig',
	description: 'Random adress',
	guildOnly: true,
	args: true,

	execute(message, args) {
		var adresses = []
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var listeRue = ['R', 'R.', 'Ru', 'Ru.', 'Rue', 'Rue.', 'Rues', 'Rues.', 'Ruee'];
		var nombreRue = args[0];
		args.splice(0, 2); // on enlève le numéro de la rue (qu'on a save juste avant), et aussi le mot "rue" qu'on va générer aléatoirement

		for (let index = 0; index < 10; index++) {
			let result = '';
			
			for (var i = 0; i < 4; i++) {
				result += characters.charAt(Math.floor(Math.random() * characters.length));
			}
			var rue = listeRue[Math.floor(Math.random() * listeRue.length)]
			adresses.push(nombreRue + ' ' + rue + ' ' + args.join(" ") + ' ' + result);
		}
		message.channel.send(adresses);
	}
};

