import GeneralError from "./GeneralError";

export class NoMemberError extends GeneralError {
    constructor() {
        super(`Member expected but were not there`);
    }
}
