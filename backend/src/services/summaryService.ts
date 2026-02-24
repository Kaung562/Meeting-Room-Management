import { getBookingRepo } from './bookingService';
import { getUserRepo } from './userService';

export interface UserSummaryItem {
  user: { id: number; username: string; name: string; role: string };
  totalBookings: number;
  bookings: { id: number; roomId: number; roomName: string; startTime: Date; endTime: Date }[];
}

export async function getUsageSummary(): Promise<UserSummaryItem[]> {
  const userRepo = getUserRepo();
  const bookingRepo = getBookingRepo();
  const users = await userRepo.find({ order: { name: 'ASC' } });
  const bookings = await bookingRepo.find({
    relations: ['user', 'room'],
    order: { startTime: 'ASC' },
  });

  const byUserId = new Map<number, UserSummaryItem>();
  for (const u of users) {
    byUserId.set(u.id, {
      user: { id: u.id, username: u.username, name: u.name, role: (u.role ?? '').toUpperCase() },
      totalBookings: 0,
      bookings: [],
    });
  }

  for (const b of bookings) {
    let item = byUserId.get(b.userId);
    if (!item) {
      item = {
        user: {
          id: b.userId,
          username: b.user?.username ?? `user_${b.userId}`,
          name: b.user?.name ?? 'Unknown',
          role: ((b.user as { role?: string })?.role ?? 'USER').toUpperCase(),
        },
        totalBookings: 0,
        bookings: [],
      };
      byUserId.set(b.userId, item);
    }
    item.bookings.push({
      id: b.id,
      roomId: b.roomId,
      roomName: b.room?.name ?? `Room #${b.roomId}`,
      startTime: b.startTime,
      endTime: b.endTime,
    });
    item.totalBookings += 1;
  }

  return Array.from(byUserId.values());
}
