import BotMisuseError from "./BotMisuseError";

export class QueueAccessError extends BotMisuseError {
    constructor(message: string) {
        super(message);
    }
}
