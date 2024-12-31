export class UnexpectedError extends Error {
    constructor(msg:string) {
        super(`Unexpected error: ${msg}`);
    }
}
