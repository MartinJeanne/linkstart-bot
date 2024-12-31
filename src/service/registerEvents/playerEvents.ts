import { Player } from "discord-player";

export async function playerOnError(player: Player) {
    player.events.on('error', (queue, error) => {
        // Emitted when the player queue encounters error
        console.log(`General player error event: ${error.message}`);
        console.log(error);
    });

    player.events.on('playerError', (queue, error) => {
        // Emitted when the audio player errors while streaming audio track
        console.log(`Player error event: ${error.message}`);
        console.log(error);
    });
}

export async function playerOnDebug(player: Player) {
    player.on('debug', async (message) => {
        // Emitted when the player sends debug info
        // Useful for seeing what dependencies, extractors, etc are loaded
        console.log(`General player debug event: ${message}`);
    });

    player.events.on('debug', async (queue, message) => {
        // Emitted when the player queue sends debug info
        // Useful for seeing what state the current queue is at
        console.log(`Player debug event: ${message}`);
    });
}

export async function playerCommonEvents(player: Player) {
    player.events.on('playerStart', (queue, track) => {
        // Emitted when the player starts to play a song
        queue.metadata.send(`▶️ Je joue : **${track.title}**`);
    });

    player.events.on('audioTrackAdd', (queue, track) => {
        // Emitted when the player adds a single song to its queue
        queue.metadata.send(`:ballot_box_with_check: Ajoutée à la file : **${track.title}**`);
    });

    player.events.on('audioTracksAdd', (queue, track) => {
        // Emitted when the player adds multiple songs to its queue
        queue.metadata.send(`:ballot_box_with_check: Plusieurs musiques ajoutées`);
    });

    player.events.on('playerSkip', (queue, track) => {
        // Emitted when the audio player fails to load the stream for a song
        queue.metadata.send(`⏩ Musique passée : **${track.title}**`);
    });

    player.events.on('disconnect', (queue) => {
        // Emitted when the bot leaves the voice channel
        queue.metadata.send('⏹️ Tschüss!');
    });
    player.events.on('emptyChannel', (queue) => {
        // Emitted when the voice channel has been empty for the set threshold
        // Bot will automatically leave the voice channel with this event
        //queue.metadata.send(`Plus personne dans le channel ? Je m'en vais !`);
    });
    player.events.on('emptyQueue', (queue) => {
        // Emitted when the player queue has finished
        //queue.metadata.send('✅ Fin de la file de musique !');
    });
}
