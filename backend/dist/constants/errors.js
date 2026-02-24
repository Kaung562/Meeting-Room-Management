"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLES = exports.AuthErrors = exports.BookingErrors = exports.UserErrors = void 0;
exports.UserErrors = {
    NOT_FOUND: 'User not found',
    NAME_REQUIRED: 'name is required',
    USERNAME_REQUIRED: 'username is required',
    PASSWORD_REQUIRED: 'password is required',
    USERNAME_TAKEN: 'username already taken',
    ROLE_INVALID: 'role must be admin, owner, or user',
    CANNOT_DELETE_SELF: 'Cannot delete your own user',
};
exports.BookingErrors = {
    NOT_FOUND: 'Booking not found',
    START_END_REQUIRED: 'Start Time and End Time are required',
    INVALID_DATE: 'Invalid date format; use ISO 8601',
    START_NOT_IN_PAST: 'Start Time must be now or later',
    START_BEFORE_END: 'Start Time must be before End Time',
    OVERLAP: 'Booking overlaps with an existing booking',
    DELETE_OWN_ONLY: 'You can only delete your own bookings',
};
exports.AuthErrors = {
    MISSING_USER_ID: 'Missing x-user-id header',
    USER_NOT_FOUND: 'User not found',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    NOT_AUTHENTICATED: 'Not authenticated',
    INVALID_CREDENTIALS: 'Invalid username or password',
};
exports.ROLES = ['admin', 'owner', 'user'];
