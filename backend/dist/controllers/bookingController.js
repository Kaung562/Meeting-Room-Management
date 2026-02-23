"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookings = getBookings;
exports.createBooking = createBooking;
exports.deleteBooking = deleteBooking;
const bookingService = __importStar(require("../services/bookingService"));
async function getBookings(req, res) {
    const bookings = await bookingService.getBookingsWithUser();
    res.json({ bookings });
}
async function createBooking(req, res) {
    const { startTime, endTime } = req.body;
    const booking = await bookingService.createBooking(req.currentUser.id, startTime, endTime);
    res.status(201).json({ booking });
}
async function deleteBooking(req, res) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: 'Invalid booking id' });
        return;
    }
    await bookingService.deleteBooking(id, req.currentUser.id, req.currentUser.role);
    res.status(204).send();
}
