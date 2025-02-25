export class NoOptionError extends Error {
    constructor(option: string) {
        super(`Expected option not there: ${option}`);
    }
}

export class UnexpectedChoiceOptionError extends Error {
    constructor(choice: string | number) {
        super(`Unexpected choice option: ${choice}`);
    }
}
