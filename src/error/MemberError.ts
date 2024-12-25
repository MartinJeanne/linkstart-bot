export class NoMemberError extends Error {
    constructor() {
        super(`Member expected but were not there`);
    }
}
