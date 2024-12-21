const { Events } = require('discord.js');
const { messageCreate, messageReactionAdd, messageReactionRemove } = require('./messageEvents.js');
const { getOrCreateMember } = require('../../endpoints/members.js');
const { getMessages } = require('../../endpoints/messages.js');
const { postGuild } = require('../../endpoints/guilds.js');
const { getRoleReaction } = require('../../endpoints/roleReaction.js');
const schedule = require('node-schedule');
const birthdayAdvertiser = require('../birthdayAdvertiser.js');
const { matchBotStatusToMcPlayerNb } = require('./minecraftServer.js');

let messages;

module.exports = async function (client) {

    // When user uses a slash (/) command!
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await interaction.deferReply({ ephemeral: command.isEphemeral });
            const member = await getOrCreateMember(interaction.member);
            await client.player.context.provide(interaction.guild, async () => {
                await command.execute(interaction, client, member);
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "❌ Erreur lors de l'execution de cette commande", ephemeral: true });
        }
    });

    // When member join the server
    client.on(Events.GuildMemberAdd, member => {
        // Adding "Nouveau" to new user when they join the server
        if (member.guild.id === '485000880114892821') member.roles.add('485021407529664526');
    });

    // When member leave the server
    client.on(Events.GuildMemberRemove, async member => {
        if (member.guild.id === '485000880114892821') {
            const channel = await client.channels.cache.get('788781047420420137');
            channel.send(`Tchuss, ${member}`);
        }
    });

    client.on(Events.GuildCreate, guild => {
        postGuild(guild);
    });

    messageCreate(client);

    // Once bot is started
    client.once(Events.ClientReady, async () => {
        /* Old 
        messages = await getMessages();
        matchBotStatusToMcPlayerNb(client);
        */
        /* discord-player debug
        console.log(client.player.scanDeps()); 
        client.player.on('debug', console.log);
        client.player.events.on('debug', (queue, message) => console.log(`[DEBUG ${queue.guild.id}] ${message}`)); 
        */

        schedule.scheduleJob('30 8 * * *', () => { birthdayAdvertiser(client) });
        console.log(`${client.user.tag} est lancé !`);
    });
};
