import { ChatInputCommandInteraction } from "discord.js";
import { QueryType } from 'discord-player';
import { useMainPlayer } from 'discord-player';
import getQueue from '../../service/queue/getQueue';
import { addSongToQueue, addPlaylistToQueue } from '../../service/queue/addSongsToQueue.js';


export default async function (interaction: ChatInputCommandInteraction, toSearch: string): Promise<string> {
    const player = useMainPlayer();

    const result = await player.search(toSearch, {
        requestedBy: interaction.user,
        //searchEngine: QueryType.SPOTIFY_SEARCH,
    });

    const queue = await getQueue(interaction);
    if (!queue) return 'todo fix';

    try {
        const tracks = result.tracks;
        if (tracks.length === 0) {
            return ':interrobang: Pas de résultat pour cette recherche';
        }
        else if (result.playlist) {
            const reply = addPlaylistToQueue(tracks, result.playlist, queue);
            return reply;
        }
        else {
            const reply = addSongToQueue(tracks[0], queue);
            return reply
        }
    } catch (error) {
        console.error(error);
        return '❌ Erreur lors de la lecture de la musique';
    }
}
