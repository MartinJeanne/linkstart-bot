const { Events, ChannelType } = require('discord.js');

const garwalleId = '306129521990565888';

async function reactionForRole(reaction) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('❌ Il y a eu une erreur lors du fetch du message:', error);
            return;
        }
    }

    const ids = messages.map(message => message.id);
    if (!ids.includes(reaction.message.id)) return;
    roleReactions = await getRoleReaction(reaction.message.id, reaction.emoji.name);

    return roleReactions?.role;
}

exports.messageReactionAdd = async function (client) {
    client.on(Events.MessageReactionAdd, async (reaction, user) => {
        const role = await reactionForRole(reaction);
        if (!role) return;
        const member = await reaction.message.guild.members.fetch(user.id);
        member.roles.add(role);
    });
}

exports.messageReactionRemove = async function (client) {
    client.on(Events.MessageReactionRemove, async (reaction, user) => {
        const role = await reactionForRole(reaction);
        if (!role) return;
        const member = await reaction.message.guild.members.fetch(user.id);
        member.roles.remove(role);
    });
}

exports.guildIdsFeur = [];

const feurResponses = [
    'Feur.',
    'Feur !',
    '# Feur.'
]

exports.messageCreate = async function (client) {
    client.on(Events.MessageCreate, async message => {
        // DM
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

        // Feur
        exports.guildIdsFeur.forEach(guildId => {
            if (guildId == message.guildId && message.content.search(/quoi/gi) >= 0) {
                const random = Math.floor(Math.random() * feurResponses.length);
                message.reply(feurResponses[random]);
            }
        });

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
}
