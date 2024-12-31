export class NoOptionError extends Error {
    constructor(option: string) {
        super(`Expected option not there: ${option}`);
    }
}
