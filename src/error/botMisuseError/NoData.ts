import BotMisuseError from "./BotMisuseError";

export class NoData extends BotMisuseError {
    constructor(message: string) {
        super(message);
    }
}
