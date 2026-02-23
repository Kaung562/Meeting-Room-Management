"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ResponseError_1 = require("../errorHandlers/ResponseError");
function errorHandler(err, req, res, _next) {
    if (err instanceof ResponseError_1.ResponseError) {
        const body = { error: err.message };
        if (err.details !== undefined)
            body.details = err.details;
        res.status(err.statusCode).json(body);
        return;
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
