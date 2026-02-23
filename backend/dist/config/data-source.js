"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Booking_1 = require("../entities/Booking");
const dotenv_1 = __importDefault(require("dotenv"));
// Load backend/.env (works from dist/config/ or src/config/)
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASS || process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'meeting_room_booking',
    synchronize: process.env.NODE_ENV !== 'production',
    dropSchema: false, // set to true in server.ts when DB_DROP_AND_CREATE=true
    logging: process.env.DB_LOGGING === 'true',
    entities: [User_1.User, Booking_1.Booking],
    migrations: [],
    subscribers: [],
});
