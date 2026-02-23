"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsageSummary = getUsageSummary;
const bookingService_1 = require("./bookingService");
const userService_1 = require("./userService");
async function getUsageSummary() {
    const userRepo = (0, userService_1.getUserRepo)();
    const bookingRepo = (0, bookingService_1.getBookingRepo)();
    const users = await userRepo.find({ order: { name: 'ASC' } });
    const bookings = await bookingRepo.find({
        relations: ['user'],
        order: { startTime: 'ASC' },
    });
    const byUserId = new Map();
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
                    role: b.user?.role ?? 'user',
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
