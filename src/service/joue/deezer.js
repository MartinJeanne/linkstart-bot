const { QueryType } = require('discord-player');
const { useMainPlayer } = require('discord-player');
const getQueue = require('../../service/queue/getQueue.js');
const { addSongToQueue, addPlaylistToQueue } = require('../../service/queue/addSongsToQueue.js');

module.exports = async function (interaction, toSearch) {
    const player = useMainPlayer();

    const result = await player.search(toSearch, {
        requestedBy: interaction.user,
        //searchEngine: QueryType.SPOTIFY_SEARCH,
    });

    const queue = await getQueue({ interaction: interaction, canCreate: true });
    if (!queue) return;

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
