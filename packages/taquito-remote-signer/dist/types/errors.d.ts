export declare class KeyNotFoundError implements Error {
    message: string;
    innerException: any;
    name: string;
    constructor(message: string, innerException: any);
}
export declare class OperationNotAuthorizedError implements Error {
    message: string;
    innerException: any;
    name: string;
    constructor(message: string, innerException: any);
}
export declare class BadSigningDataError implements Error {
    message: string;
    innerException: any;
    readonly data: any;
    name: string;
    constructor(message: string, innerException: any, data: any);
}
