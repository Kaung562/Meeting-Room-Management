/**
 * Ensures the seed admin user exists (username: admin, password: admin123).
 * - If no user with username "admin" exists, creates one with role admin.
 * - Run after DB init (and after drop+recreate when DB_DROP_AND_CREATE=true).
 */
export declare function seedAdmin(): Promise<void>;
