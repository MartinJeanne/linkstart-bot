import fetchOptions from "../../model/FetchOption";
import GeneralError from "./GeneralError";


export class DeleteError extends GeneralError {
    constructor(endpoint:string) {
        super(`Something went wrong in DELETE for endpoint: ${endpoint}`);
    }
}

export class FetchAfterAuthError extends GeneralError {
    constructor(endpoint:string, options: fetchOptions) {
        super(`After auth, no result from endpoint: ${endpoint}\nOptions: ${options}`);
    }
}
