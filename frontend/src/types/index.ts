export type UserRole = 'ADMIN' | 'OWNER' | 'USER';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
}

export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  userName?: string | null;
  room?: { id: number; name: string };
}

export interface Room {
  id: number;
  name: string;
}

export interface UserSummaryItem {
  user: { id: number; username: string; name: string; role: string };
  totalBookings: number;
  bookings: { id: number; roomId: number; roomName: string; startTime: string; endTime: string }[];
}
