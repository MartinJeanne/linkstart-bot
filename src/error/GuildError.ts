export class NoGuildError extends Error {
    constructor() {
        super(`Guild expected but were not there`);
    }
}
