"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'ResponseError';
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}
exports.ResponseError = ResponseError;
