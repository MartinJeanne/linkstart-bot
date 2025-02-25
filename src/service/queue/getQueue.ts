/** Check if user can use Player commands */
import { GuildQueue, useMainPlayer } from 'discord-player';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { NoMemberError } from '../../error/generalError/MemberError';
import { NoGuildError } from '../../error/generalError/GuildError';
import { QueueAccessError } from '../../error/botMisuseError/QueueError';


async function getQueue(interaction: ChatInputCommandInteraction, canCreate: boolean = true): Promise<GuildQueue> {
	if (!interaction.member || !(interaction.member instanceof GuildMember)) throw new NoMemberError();
	if (!interaction.guild) throw new NoGuildError();

	const lkBot = interaction.guild.members.me;

	// if user is not in channel
	if (!interaction.member.voice.channel)
		throw new QueueAccessError('Tu dois être dans un salon vocal pour cela');

	// if bot is in channel AND user is not in the same channel
	else if (lkBot && lkBot.voice.channelId && interaction.member.voice.channelId !== lkBot.voice.channelId)
		throw new QueueAccessError('Tu dois être dans le même salon vocal que moi pour cela');


	const player = useMainPlayer();
	const queue = player.nodes.get(interaction.guild.id);
	if (queue) return queue;

	if (!canCreate)
		throw new QueueAccessError('Je ne joue pas de musique actuellement !');

	// Create the server queue with options
	const newQueue = player.nodes.create(interaction.guild, {
		leaveOnEnd: false,
		leaveOnStop: true,
		leaveOnEmpty: true,
		metadata: interaction.channel
	});

	if (!newQueue.connection)
		await newQueue.connect(interaction.member.voice.channel);
	return newQueue;
}

export default getQueue;
