import { User } from './User';
export declare class Booking {
    id: number;
    userId: number;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
    user?: User;
}
