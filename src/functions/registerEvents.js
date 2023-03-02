module.exports = async function (client) {
    // When user uses a slash (/) command!
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await interaction.deferReply({ ephemeral: command.isEphemeral });
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "❌ Une erreur c'est produite lors de l'exécution de cette commande, reportez ce problème à un modérateur", ephemeral: true });
        }
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

    // TODO Remove once the stop song bug is corrected
    const { VoiceConnectionStatus } = require('@discordjs/voice');

    // v6
    client.player.events.on('connection', (queue) => {
        queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
            if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) {
                queue.dispatcher.voiceConnection.configureNetworking();
            }
        });
    });

    // Once bot is started
    client.once('ready', () => {
        console.log(`${client.user.tag} est lancé !`)
    });
};
