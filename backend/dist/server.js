"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
// Load .env from backend folder so it works when run from project root or backend/
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
const data_source_1 = require("./config/data-source");
const seed_1 = require("./config/seed");
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 3001;
const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;
async function dropAllTables() {
    const client = databaseUrl
        ? new pg_1.Client({ connectionString: databaseUrl })
        : new pg_1.Client({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASS || process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'meeting_room_booking',
        });
    await client.connect();
    try {
        await client.query('DROP TABLE IF EXISTS "bookings" CASCADE');
        await client.query('DROP TABLE IF EXISTS "users" CASCADE');
        console.log('Dropped existing tables (bookings, users).');
    }
    finally {
        await client.end();
    }
}
async function main() {
    const dropAndCreate = process.env.DB_DROP_AND_CREATE === 'true';
    if (dropAndCreate) {
        console.log('DB_DROP_AND_CREATE=true: dropping all tables, then recreating.');
        await dropAllTables();
    }
    await data_source_1.AppDataSource.initialize();
    await (0, seed_1.seedAdmin)();
    app_1.default.listen(PORT, () => {
        console.log(`Meeting Room Booking API listening on http://localhost:${PORT}`);
    });
}
main().catch((err) => {
    console.error('Failed to start:', err?.message ?? err);
    if (err?.code === '28P01' || err?.message?.includes('password authentication failed')) {
        console.error('\n→ Check backend/.env: DATABASE_URL/DB_URL (recommended) or DB_USERNAME/DB_USER, DB_PASSWORD/DB_PASS, DB_HOST, DB_NAME.');
        console.error('  Ensure the database exists and the postgres user password is correct.');
    }
    if (err?.message?.includes('contains null values')) {
        console.error('\n→ Old table structure detected. In backend/.env set: DB_DROP_AND_CREATE=true');
        console.error('  Then run npm start once to drop and recreate tables. Then set it back to false.');
    }
    process.exit(1);
});
