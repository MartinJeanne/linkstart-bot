import GeneralError from "./GeneralError";

export class NoChannelError extends GeneralError {
    constructor() {
        super(`Channel expected but not there`);
    }
}
