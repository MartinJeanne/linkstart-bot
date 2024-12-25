import { Client, ClientOptions, Collection } from "discord.js";

export class ClientEx extends Client {
    public commands: Collection<string, any>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}
