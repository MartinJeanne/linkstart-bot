import GeneralError from "./GeneralError";

export class NoGuildError extends GeneralError {
    constructor() {
        super(`Guild expected but were not there`);
    }
}
