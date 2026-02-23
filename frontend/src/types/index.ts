export type UserRole = 'admin' | 'owner' | 'user';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
}

export interface Booking {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  userName?: string | null;
}

export interface UserSummaryItem {
  user: { id: number; name: string; role: string };
  totalBookings: number;
  bookings: { id: number; startTime: string; endTime: string }[];
}
