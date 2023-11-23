/** Check if user can use Player commands */
module.exports = async function (client) {

	const channel = client.channels.cache.get('790692532928905257');
	return channel.send(`Bon anniversaire !`);
};
