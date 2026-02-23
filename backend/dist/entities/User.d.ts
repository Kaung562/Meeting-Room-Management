import { Booking } from './Booking';
export type UserRole = 'admin' | 'owner' | 'user';
export declare class User {
    id: number;
    username: string;
    password: string;
    name: string;
    role: UserRole;
    bookings: Booking[];
}
