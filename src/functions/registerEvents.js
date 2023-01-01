module.exports = function (client) {
    // Once bot is started
    client.once('ready', () => {
        console.log(`${client.user.tag} est prêt !`)
    });

    // When member join the server
    client.on('guildMemberAdd', member => {
        // Adding "Nouveau" to new user when they join the server
        if (member.guild.id == '485000880114892821') member.roles.add('485021407529664526');
    });

    // When member leave the server
    client.on('guildMemberRemove', member => {
        if (member.guild.id == '485000880114892821') {
            const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
            channel.send(`Bye, ${member}`);
        }
    });
};