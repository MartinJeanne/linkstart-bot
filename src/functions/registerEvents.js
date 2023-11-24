const { Events, ActivityType, ChannelType } = require('discord.js');
const { getDiscordMessages } = require('../endpoints/discordMessage.js');
const { getRoleReaction: getRoleReaction } = require('../endpoints/roleReaction.js');
const schedule = require('node-schedule');
const birthdayAdvertiser = require('./birthdayAdvertiser.js');

const garwalleId = '306129521990565888';
let discordMessages;
let roleReactions;

module.exports = async function (client) {
    async function reactionForRole(reaction) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('❌ Il y a eu une erreur lors du fetch du message:', error);
                return;
            }
        }

        const discordIds = discordMessages.map(discordMessage => discordMessage.discordId);
        if (!discordIds.includes(reaction.message.id)) return;
        roleReactions = await getRoleReaction(reaction.message.id, reaction.emoji.name);

        return roleReactions?.role;
    }

    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        const role = await reactionForRole(reaction);
        if (!role) return;
        const member = await reaction.message.guild.members.fetch(user.id);
        member.roles.add(role);
    });


    client.on(Events.MessageReactionRemove, async (reaction, user) => {
        const role = await reactionForRole(reaction);
        if (!role) return;
        const member = await reaction.message.guild.members.fetch(user.id);
        member.roles.remove(role);
    });

    // When user uses a slash (/) command!
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await interaction.deferReply({ ephemeral: command.isEphemeral });
            await command.execute(interaction, client);
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
    client.on(Events.GuildMemberRemove, member => {
        if (member.guild.id === '485000880114892821') {
            const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
            channel.send(`Bye, ${member}`);
        }
    });

    client.on(Events.MessageCreate, async message => {
        if (message.channel.type === ChannelType.DM) {
            if (message.author.id === garwalleId) {
                try {
                    const msgArray = message.content.split(' ');
                    const channel = client.channels.cache.get(msgArray.shift());
                    return channel.send(msgArray.join(' '));
                } catch (error) {
                    console.error(error);
                }
            } else {
                const channel = client.channels.cache.get('788781047420420137');
                return channel.send(`${message.author} : ${message.content}`);
            }
        }

        if (!message.mentions.has(client.user.id) || message.mentions.everyone) return;

        if (message.member.id === garwalleId && message.content[0] === 'R')
            return await message.channel.send(`Ok.`);

        else if (message.member.id === garwalleId)
            return await message.channel.send(`Ouais boss ?`);

        else if (message.member.id === '256876632046960641')
            return await message.channel.send(`Ca va boubou ?`);

        else if (message.member.id === '365125783968022529')
            return await message.channel.send(`Ca fart Pokix ?`);

        else if (message.member.id === '161970745117769728')
            return await message.channel.send(`Mécaniquement iron ou quoi ?`);
    });

    // Once bot is started
    client.once(Events.ClientReady, async () => {
        discordMessages = await getDiscordMessages();
        schedule.scheduleJob('5 * * * *', () => { birthdayAdvertiser(client) });
        
        client.user.setActivity('/chut', { type: ActivityType.Watching });
        console.log(`${client.user.tag} est lancé !`);
    });
};