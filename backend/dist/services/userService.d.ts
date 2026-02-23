import { User } from '../entities/User';
import type { UserRole } from '../entities/User';
export declare function getUserRepo(): import("typeorm").Repository<User>;
export declare function findUserById(id: number): Promise<User | null>;
export declare function findUserByUsername(username: string, withPassword?: boolean): Promise<User | null>;
export declare function getUsers(): Promise<User[]>;
export declare function validateUserExists(id: number): Promise<User>;
export declare function createUser(data: {
    username: string;
    password: string;
    name: string;
    role: UserRole;
}): Promise<User>;
export declare function updateUserRole(id: number, role: UserRole): Promise<User>;
/**
 * Delete user. System behavior: all bookings created by this user are deleted (CASCADE).
 */
export declare function deleteUser(id: number, currentUserId: number): Promise<void>;
export declare function verifyLogin(username: string, password: string): Promise<User>;
