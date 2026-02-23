export declare const UserErrors: {
    readonly NOT_FOUND: "User not found";
    readonly NAME_REQUIRED: "name is required";
    readonly USERNAME_REQUIRED: "username is required";
    readonly PASSWORD_REQUIRED: "password is required";
    readonly USERNAME_TAKEN: "username already taken";
    readonly ROLE_INVALID: "role must be admin, owner, or user";
    readonly CANNOT_DELETE_SELF: "Cannot delete your own user";
};
export declare const BookingErrors: {
    readonly NOT_FOUND: "Booking not found";
    readonly START_END_REQUIRED: "startTime and endTime are required";
    readonly INVALID_DATE: "Invalid date format; use ISO 8601";
    readonly START_BEFORE_END: "startTime must be before endTime";
    readonly OVERLAP: "Booking overlaps with an existing booking";
    readonly DELETE_OWN_ONLY: "You can only delete your own bookings";
};
export declare const AuthErrors: {
    readonly MISSING_USER_ID: "Missing x-user-id header";
    readonly USER_NOT_FOUND: "User not found";
    readonly INSUFFICIENT_PERMISSIONS: "Insufficient permissions";
    readonly NOT_AUTHENTICATED: "Not authenticated";
    readonly INVALID_CREDENTIALS: "Invalid username or password";
};
export declare const ROLES: readonly ["admin", "owner", "user"];
export type Role = (typeof ROLES)[number];
