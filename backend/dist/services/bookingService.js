"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingRepo = getBookingRepo;
exports.findBookingById = findBookingById;
exports.getBookingsWithUser = getBookingsWithUser;
exports.createBooking = createBooking;
exports.deleteBooking = deleteBooking;
const data_source_1 = require("../config/data-source");
const Booking_1 = require("../entities/Booking");
const ResponseError_1 = require("../errorHandlers/ResponseError");
const errors_1 = require("../constants/errors");
/**
 * Overlap rule: half-open intervals [start, end).
 * Two slots overlap iff start1 < end2 && start2 < end1.
 * Back-to-back (one's endTime === other's startTime) is allowed.
 */
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
    return aStart.getTime() < bEnd.getTime() && bStart.getTime() < aEnd.getTime();
}
function getBookingRepo() {
    return data_source_1.AppDataSource.getRepository(Booking_1.Booking);
}
async function findBookingById(id) {
    return getBookingRepo().findOne({
        where: { id },
        relations: ['user'],
    });
}
async function getBookingsWithUser() {
    const bookings = await getBookingRepo().find({
        relations: ['user'],
        order: { startTime: 'ASC' },
    });
    return bookings.map((b) => ({
        ...b,
        userName: b.user?.name ?? null,
    }));
}
function validateTimeOrder(startTime, endTime) {
    if (!startTime || !endTime) {
        throw new ResponseError_1.ResponseError(400, errors_1.BookingErrors.START_END_REQUIRED);
    }
    const s = new Date(startTime).getTime();
    const e = new Date(endTime).getTime();
    if (Number.isNaN(s) || Number.isNaN(e)) {
        throw new ResponseError_1.ResponseError(400, errors_1.BookingErrors.INVALID_DATE);
    }
    if (s >= e) {
        throw new ResponseError_1.ResponseError(400, errors_1.BookingErrors.START_BEFORE_END);
    }
}
async function createBooking(userId, startTime, endTime) {
    validateTimeOrder(startTime, endTime);
    const start = new Date(startTime);
    const end = new Date(endTime);
    const existing = await getBookingRepo().find();
    for (const b of existing) {
        if (rangesOverlap(start, end, b.startTime, b.endTime)) {
            throw new ResponseError_1.ResponseError(400, errors_1.BookingErrors.OVERLAP, {
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
async function deleteBooking(bookingId, currentUserId, currentUserRole) {
    const booking = await findBookingById(bookingId);
    if (!booking)
        throw new ResponseError_1.ResponseError(404, errors_1.BookingErrors.NOT_FOUND);
    const canDeleteAny = currentUserRole === 'owner' || currentUserRole === 'admin';
    const isOwn = booking.userId === currentUserId;
    if (!canDeleteAny && !isOwn) {
        throw new ResponseError_1.ResponseError(403, errors_1.BookingErrors.DELETE_OWN_ONLY);
    }
    await getBookingRepo().remove(booking);
}
