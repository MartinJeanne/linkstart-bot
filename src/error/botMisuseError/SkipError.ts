import BotMisuseError from "./BotMisuseError";

export class TrackLoopNotSkipableError extends BotMisuseError {
    constructor() {
        super('Impossible de passer, la musique est mise en boucle');
    }
}
