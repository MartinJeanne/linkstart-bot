import { GuildQueue, Playlist, Track } from "discord-player";
import { NoOptionError } from "../../error/NoOptionError";


export function addSongToQueue(track: Track, queue: GuildQueue) {
	if (!track || !queue) throw new Error('Missing arg in: addSongToQueue');
	queue.addTrack(track);

	const title = track.title ? track.title : 'Musique sans titre';
	if (!queue.isPlaying()) {
		queue.node.play();
		return `▶️ Je joue : **${title}**`;
	} else {
		return `:ballot_box_with_check: Ajoutée à la file : **${title}**`;
	}
}

export function addPlaylistToQueue(tracks: Array<Track>, playlist: Playlist, queue: GuildQueue) {
	if (!tracks || !playlist || !queue) throw new NoOptionError('tracks || playlist || queue');
	queue.addTrack(tracks);

	return `▶️ **${tracks.length}** musiques ajoutées depuis la ${playlist.type} : **${playlist.title}** `;
}
