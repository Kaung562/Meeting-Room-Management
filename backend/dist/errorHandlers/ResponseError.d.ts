export declare class ResponseError extends Error {
    statusCode: number;
    details?: unknown | undefined;
    constructor(statusCode: number, message: string, details?: unknown | undefined);
}
