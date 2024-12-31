import GeneralError from "./GeneralError";

export class NoClientUserError extends GeneralError {
    constructor() {
        super(`Unexpected error, client.user was null`);
    }
}
