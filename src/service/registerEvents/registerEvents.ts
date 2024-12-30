import { Events, TextChannel } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import schedule from 'node-schedule';
import { ClientEx } from '../../model/Client'
import { playerOnError } from './playerEvents';
import { messageCreate } from './messageEvents';
import { postGuild } from '../endpoints/guilds';
import birthdayAdvertiser from '../birthdayAdvertiser';
import { UnexpectedError } from '../../error/UnexpectedError';


export default async function (client: ClientEx) {
    const player = useMainPlayer();

    /** When user uses a slash (/) command! */
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            /** Defer reply */
            await interaction.deferReply({ ephemeral: command.isEphemeral });

            /** Provide context for discord-player, and execute cmd */
            if (!interaction.guild) throw new UnexpectedError('guild is null');
            const pData = { guild: interaction.guild };
            await player.context.provide(pData, () => command.execute(interaction));
        } catch (error) {
            console.error(error);
            await interaction.editReply("❌ Erreur lors de l'execution de cette commande");
        }
    });

    client.on(Events.GuildMemberAdd, member => {
        /** Adding "Nouveau" to new user as they join the server */
        if (member.guild.id === '485000880114892821') member.roles.add('485021407529664526');
    });

    client.on(Events.GuildMemberRemove, async member => {
        if (member.guild.id === '485000880114892821') {
            // todo fix
            const channel = client.channels.cache.get('788781047420420137') as TextChannel | undefined;
            if (!channel) return;
            channel.send(`Tchuss, ${member}`);
        }
    });

    client.on(Events.GuildCreate, guild => {
        postGuild(guild);
    });

    messageCreate(client);

    /** discord-player */
    //playerCommonEvents(player);
    //console.log(player.scanDeps());
    //playerOnDebug(player);
    playerOnError(player);


    /** Once bot is started */
    client.once(Events.ClientReady, async () => {
        //messages = await getMessages();
        //matchBotStatusToMcPlayerNb(client);

        schedule.scheduleJob('30 8 * * *', () => { birthdayAdvertiser(client) });
        if (!client.user) throw Error('client.user is nul, bot didn\'t initialize correctly');
        console.log(`${client.user.tag} est lancé !`);
    });
};
