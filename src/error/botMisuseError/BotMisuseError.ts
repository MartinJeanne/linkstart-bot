export default class BotMisuseError extends Error {

    constructor(message: string) {
        super(`:interrobang: ${message}`);
    }
}
