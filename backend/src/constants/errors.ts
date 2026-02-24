export const UserErrors = {
  NOT_FOUND: 'User not found',
  NAME_REQUIRED: 'name is required',
  USERNAME_REQUIRED: 'username is required',
  PASSWORD_REQUIRED: 'password is required',
  USERNAME_TAKEN: 'username already taken',
  ROLE_INVALID: 'role must be ADMIN, OWNER, or USER',
  CANNOT_DELETE_SELF: 'Cannot delete your own user',
} as const;

export const BookingErrors = {
  NOT_FOUND: 'Booking not found',
  ROOM_ID_REQUIRED: 'roomId is required and must be an integer',
  ROOM_NOT_FOUND: 'Room not found',
  START_END_REQUIRED: 'Start Time and End Time are required',
  INVALID_DATE: 'Invalid date format; use ISO 8601',
  START_NOT_IN_PAST: 'Start Time must be now or later',
  START_BEFORE_END: 'Start Time must be before End Time',
  OVERLAP: 'Booking overlaps with an existing booking',
  DELETE_OWN_ONLY: 'You can only delete your own bookings',
} as const;

export const AuthErrors = {
  MISSING_USER_ID: 'Missing x-user-id header',
  USER_NOT_FOUND: 'User not found',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  NOT_AUTHENTICATED: 'Not authenticated',
  INVALID_CREDENTIALS: 'Invalid username or password',
} as const;

export const ROLES = ['ADMIN', 'OWNER', 'USER'] as const;
export type Role = (typeof ROLES)[number];
