const { Events } = require('discord.js');
const { getDiscordMessages } = require('../endpoints/discordMessage.js');
const { getRoleReaction: getRoleReaction } = require('../endpoints/roleReaction.js');

let discordMessages;
let roleReactions;

/* TODO
        // LearnMoreTech
        messageId: 1091361707483463742
            reaction: 'wipfire', role: '790874978819112970'
            reaction: '😎', role: '790690948199481365'

        // Eyesight
        messageId: 1077527581101936661
            reaction: 'bait', role: '1083777942515093644'
            reaction: '🎨', role: '1092404838140219472'
*/

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
        console.log(role)
        let res = member.roles.add(role);
        console.log(res)
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

        if (!command) return null;

        try {
            await interaction.deferReply({ ephemeral: command.isEphemeral });
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: "❌ Une erreur c'est produite lors de l'exécution de cette commande, reportez ce problème à un modérateur", ephemeral: true });
        }
    });

    // When member join the server
    client.on(Events.GuildMemberAdd, member => {
        // Adding "Nouveau" to new user when they join the server
        if (member.guild.id == '485000880114892821') member.roles.add('485021407529664526');
    });

    // When member leave the server
    client.on(Events.GuildMemberRemove, member => {
        if (member.guild.id == '485000880114892821') {
            const channel = member.guild.channels.cache.find(ch => ch.name === 'chat-modérateur');
            channel.send(`Bye, ${member}`);
        }
    });

    client.on(Events.MessageCreate, async message => {
        if (!message.mentions.has(client.user.id)) return;

        if (message.member.id == '306129521990565888')
            return await message.channel.send(`Ouais boss ?`);

        else if (message.member.id == '306129521990565888' && message.content[0] == 'R')
            return await message.channel.send(`Ok.`);

        else if (message.member.id == '256876632046960641')
            return await message.channel.send(`Oui ? Ca va boubou ?`);

        else if (message.member.id == '365125783968022529')
            return await message.channel.send(`Tranquille le woi wabbit ?`);

        else if (message.member.id == '161970745117769728')
            return await message.channel.send(`Mécaniquement iron ou quoi ?`);

        else return message.channel.send(`Ptdr t ki (si t'as besoin d'aide fais /aide)`);
    });

    // Once bot is started
    client.once(Events.ClientReady, async () => {
        discordMessages = await getDiscordMessages();

        console.log(`${client.user.tag} est lancé !`);
    });
};
