import { Booking } from '../entities/Booking';
export declare function getBookingRepo(): import("typeorm").Repository<Booking>;
export declare function findBookingById(id: number): Promise<Booking | null>;
export declare function getBookingsWithUser(): Promise<(Booking & {
    userName: string | null;
})[]>;
export declare function createBooking(userId: number, startTime: string, endTime: string): Promise<Booking>;
export declare function deleteBooking(bookingId: number, currentUserId: number, currentUserRole: string): Promise<void>;
