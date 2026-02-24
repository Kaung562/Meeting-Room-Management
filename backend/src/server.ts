import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';

// Load .env from backend folder so it works when run from project root or backend/
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { AppDataSource } from './config/data-source';
import { seedAdmin, seedRooms } from './config/seed';
import app from './app';

const PORT = Number(process.env.PORT) || 3001;
const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;

async function dropAllTables(): Promise<void> {
  const client = databaseUrl
    ? new Client({ connectionString: databaseUrl })
    : new Client({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASS || process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'meeting_room_booking',
      });
  await client.connect();
  try {
    await client.query('DROP TABLE IF EXISTS "bookings" CASCADE');
    await client.query('DROP TABLE IF EXISTS "rooms" CASCADE');
    await client.query('DROP TABLE IF EXISTS "users" CASCADE');
    console.log('Dropped existing tables (bookings, rooms, users).');
  } finally {
    await client.end();
  }
}

async function main() {
  const dropAndCreate = process.env.DB_DROP_AND_CREATE === 'true';
  if (dropAndCreate) {
    console.log('DB_DROP_AND_CREATE=true: dropping all tables, then recreating.');
    await dropAllTables();
  }
  await AppDataSource.initialize();
  await seedAdmin();
  await seedRooms();

  app.listen(PORT, () => {
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
