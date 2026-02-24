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
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;
exports.AppDataSource = new typeorm_1.DataSource(databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        synchronize: process.env.NODE_ENV !== 'production',
        dropSchema: false,
        logging: process.env.DB_LOGGING === 'true',
        entities: [User_1.User, Booking_1.Booking],
        migrations: [],
        subscribers: [],
    }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASS || process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'meeting_room_booking',
        synchronize: process.env.NODE_ENV !== 'production',
        dropSchema: false,
        logging: process.env.DB_LOGGING === 'true',
        entities: [User_1.User, Booking_1.Booking],
        migrations: [],
        subscribers: [],
    });
