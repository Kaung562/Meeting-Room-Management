import { getBookingRepo } from './bookingService';
import { getUserRepo } from './userService';

export interface UserSummaryItem {
  user: { id: number; name: string; role: string };
  totalBookings: number;
  bookings: { id: number; startTime: Date; endTime: Date }[];
}

export async function getUsageSummary(): Promise<UserSummaryItem[]> {
  const userRepo = getUserRepo();
  const bookingRepo = getBookingRepo();
  const users = await userRepo.find({ order: { name: 'ASC' } });
  const bookings = await bookingRepo.find({
    relations: ['user'],
    order: { startTime: 'ASC' },
  });

  const byUserId = new Map<number, UserSummaryItem>();
  for (const u of users) {
    byUserId.set(u.id, {
      user: { id: u.id, name: u.name, role: u.role },
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
          name: b.user?.name ?? 'Unknown',
          role: (b.user as { role?: string })?.role ?? 'user',
        },
        totalBookings: 0,
        bookings: [],
      };
      byUserId.set(b.userId, item);
    }
    item.bookings.push({
      id: b.id,
      startTime: b.startTime,
      endTime: b.endTime,
    });
    item.totalBookings += 1;
  }

  return Array.from(byUserId.values());
}
