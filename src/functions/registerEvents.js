const { Events } = require('discord.js');

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

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        // When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('❌ Il y a eu une erreur lors du fetch du message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        if (reaction.message.id != '1091361707483463742') return;
        
        switch (reaction.emoji.name) {
            case '😁':
                const role = await reaction.message.guild.roles.fetch('790874978819112970');
                const member = await reaction.message.guild.members.fetch(user.id);
                member.roles.add(role);
                break;
        
            default:
                break;
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

    // Once bot is started
    client.once('ready', () => {
        console.log(`${client.user.tag} est lancé !`)
    });
};
