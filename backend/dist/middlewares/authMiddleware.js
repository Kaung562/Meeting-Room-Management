"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const userService_1 = require("../services/userService");
const ResponseError_1 = require("../errorHandlers/ResponseError");
const errors_1 = require("../constants/errors");
async function authMiddleware(req, res, next) {
    const raw = req.headers['x-user-id'];
    if (raw === undefined || raw === null || raw === '') {
        next(new ResponseError_1.ResponseError(401, errors_1.AuthErrors.MISSING_USER_ID));
        return;
    }
    const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    if (Number.isNaN(id)) {
        next(new ResponseError_1.ResponseError(401, errors_1.AuthErrors.USER_NOT_FOUND));
        return;
    }
    const user = await (0, userService_1.findUserById)(id);
    if (!user) {
        next(new ResponseError_1.ResponseError(401, errors_1.AuthErrors.USER_NOT_FOUND));
        return;
    }
    req.currentUser = user;
    next();
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.currentUser) {
            next(new ResponseError_1.ResponseError(401, errors_1.AuthErrors.NOT_AUTHENTICATED));
            return;
        }
        if (!allowedRoles.includes(req.currentUser.role)) {
            next(new ResponseError_1.ResponseError(403, errors_1.AuthErrors.INSUFFICIENT_PERMISSIONS));
            return;
        }
        next();
    };
}
