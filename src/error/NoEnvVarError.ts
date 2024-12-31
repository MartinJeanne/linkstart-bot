export class NoEnvVarError extends Error {
    constructor(expectedEnvVarName:string) {
        super(`Environnement variable expected but not found: ${expectedEnvVarName}`);
    }
}
