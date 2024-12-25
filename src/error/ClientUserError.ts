export class NoClientUserError extends Error {
    constructor() {
        super(`Unexpected error, client.user was null`);
    }
}
