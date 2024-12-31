import GeneralError from "./GeneralError";

export class ChannelError extends GeneralError {
    constructor() {
        super(`Channel expected but not there`);
    }
}
