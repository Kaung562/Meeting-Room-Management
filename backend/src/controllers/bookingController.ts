import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

export async function getBookings(req: Request, res: Response): Promise<void> {
  const bookings = await bookingService.getBookingsWithUser();
  res.json({ bookings });
}

export async function createBooking(req: Request, res: Response): Promise<void> {
  const { startTime, endTime } = req.body;
  const booking = await bookingService.createBooking(
    req.currentUser!.id,
    startTime,
    endTime
  );
  res.status(201).json({ booking });
}

export async function deleteBooking(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid booking id' });
    return;
  }
  await bookingService.deleteBooking(id, req.currentUser!.id, req.currentUser!.role);
  res.status(204).send();
}
