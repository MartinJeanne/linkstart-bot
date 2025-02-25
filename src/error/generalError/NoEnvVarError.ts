import GeneralError from "./GeneralError";

export class NoEnvVarError extends GeneralError {
    constructor(expectedEnvVarName:string) {
        super(`Environnement variable expected but not found: ${expectedEnvVarName}`);
    }
}
