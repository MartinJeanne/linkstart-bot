import { Events, ChannelType, TextChannel } from 'discord.js';
import { ClientEx } from "../../model/Client";
const { botCreatorId } = require('../user-ids');

export const guildIdsFeur: Array<string> = [];

const feurResponses = [
    'Feur.',
    'Feur !',
    '# Feur.'
]

export async function messageCreate(client: ClientEx) {

    client.on(Events.MessageCreate, async message => {
        // DM
        if (message.channel.type === ChannelType.DM) {
            if (message.author.id === botCreatorId) {
                try {
                    const msgArray = message.content.split(' ');
                    const firstEl = msgArray.shift();
                    if (!firstEl) return;
                    const channel = client.channels.cache.get(firstEl) as TextChannel | undefined;
                    if (!channel) throw Error(`No channel with id: ${firstEl}`);
                    return channel.send(msgArray.join(' '));
                } catch (error) {
                    console.error(error);
                }
            } else {
                const channel = client.channels.cache.get('788781047420420137') as TextChannel | undefined;
                if (!channel) throw Error(`No channel with id: 788781047420420137`);
                return channel.send(`${message.author} : ${message.content}`);
            }
        }

        // Feur
        guildIdsFeur.forEach(guildId => {
            if (guildId == message.guildId && message.content.search(/quoi/gi) >= 0) {
                const random = Math.floor(Math.random() * feurResponses.length);
                message.reply(feurResponses[random]);
            }
        });

        if (!client.user || !message.mentions.has(client.user.id) || message.mentions.everyone) return;

        const member = message.member;
        if (!member) return;

        if (member.id === botCreatorId && message.content[0] === 'R')
            return await message.channel.send(`Ok.`);

        else if (member.id === botCreatorId)
            return await message.channel.send(`Ouais boss ?`);

        else if (member.id === '256876632046960641')
            return await message.channel.send(`Ca va boubou ?`);

        else if (member.id === '365125783968022529')
            return await message.channel.send(`Ca fart Pokix ?`);

        else if (member.id === '161970745117769728')
            return await message.channel.send(`Mécaniquement iron ou quoi ?`);
    });
}
