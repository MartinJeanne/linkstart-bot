import fetchOptions from "../model/FetchOption";


export class DeleteError extends Error {
    constructor(endpoint:string) {
        super(`Something went wrong in DELETE for endpoint: ${endpoint}`);
    }
}

export class FetchAfterAuthError extends Error {
    constructor(endpoint:string, options: fetchOptions) {
        super(`After auth, no result from endpoint: ${endpoint}\nOptions: ${options}`);
    }
}
