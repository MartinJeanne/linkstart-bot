exports.addSongToQueue = function (track, queue) {
	if (!track || !queue) throw new Error('Missing arg in: addSongToQueue');
	queue.addTrack(track);

	const title = track.title ? track.title : 'Musique sans titre';
	if (!queue.isPlaying()) {
		queue.node.play();
		return `▶️ Je joue : **${title}**`;
	} else {
		return `:ballot_box_with_check: Ajoutée à la file : **${title}**`;
	}
};

exports.addPlaylistToQueue = function (tracks, playlist, queue) {
	if (!track || !playlist || !queue) throw new Error('Missing arg in: addPlaylistToQueue');
	queue.addTrack(tracks);

	return `▶️ **${result.tracks.length}** musiques ajoutées depuis la ${playlist.type} : **${playlist.title}** `;

}
