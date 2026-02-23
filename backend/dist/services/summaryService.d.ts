export interface UserSummaryItem {
    user: {
        id: number;
        name: string;
        role: string;
    };
    totalBookings: number;
    bookings: {
        id: number;
        startTime: Date;
        endTime: Date;
    }[];
}
export declare function getUsageSummary(): Promise<UserSummaryItem[]>;
