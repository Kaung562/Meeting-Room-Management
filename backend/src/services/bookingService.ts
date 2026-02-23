import { AppDataSource } from '../config/data-source';
import { Booking } from '../entities/Booking';
import { ResponseError } from '../errorHandlers/ResponseError';
import { BookingErrors } from '../constants/errors';

/**
 * Overlap rule: half-open intervals [start, end).
 * Two slots overlap iff start1 < end2 && start2 < end1.
 * Back-to-back (one's endTime === other's startTime) is allowed.
 */
function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart.getTime() < bEnd.getTime() && bStart.getTime() < aEnd.getTime();
}

export function getBookingRepo() {
  return AppDataSource.getRepository(Booking);
}

export async function findBookingById(id: number): Promise<Booking | null> {
  return getBookingRepo().findOne({
    where: { id },
    relations: ['user'],
  });
}

export async function getBookingsWithUser(): Promise<(Booking & { userName: string | null })[]> {
  const bookings = await getBookingRepo().find({
    relations: ['user'],
    order: { startTime: 'ASC' },
  });
  return bookings.map((b) => ({
    ...b,
    userName: b.user?.name ?? null,
  }));
}

function validateTimeOrder(startTime: string | undefined, endTime: string | undefined): void {
  if (!startTime || !endTime) {
    throw new ResponseError(400, BookingErrors.START_END_REQUIRED);
  }
  const s = new Date(startTime).getTime();
  const e = new Date(endTime).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) {
    throw new ResponseError(400, BookingErrors.INVALID_DATE);
  }
  if (s >= e) {
    throw new ResponseError(400, BookingErrors.START_BEFORE_END);
  }
}

export async function createBooking(
  userId: number,
  startTime: string,
  endTime: string
): Promise<Booking> {
  validateTimeOrder(startTime, endTime);
  const start = new Date(startTime);
  const end = new Date(endTime);

  const existing = await getBookingRepo().find();
  for (const b of existing) {
    if (rangesOverlap(start, end, b.startTime, b.endTime)) {
      throw new ResponseError(400, BookingErrors.OVERLAP, {
        overlapping: { id: b.id, startTime: b.startTime, endTime: b.endTime },
      });
    }
  }

  const booking = getBookingRepo().create({
    userId,
    startTime: start,
    endTime: end,
  });
  return getBookingRepo().save(booking);
}

export async function deleteBooking(
  bookingId: number,
  currentUserId: number,
  currentUserRole: string
): Promise<void> {
  const booking = await findBookingById(bookingId);
  if (!booking) throw new ResponseError(404, BookingErrors.NOT_FOUND);

  const canDeleteAny = currentUserRole === 'owner' || currentUserRole === 'admin';
  const isOwn = booking.userId === currentUserId;
  if (!canDeleteAny && !isOwn) {
    throw new ResponseError(403, BookingErrors.DELETE_OWN_ONLY);
  }

  await getBookingRepo().remove(booking);
}
