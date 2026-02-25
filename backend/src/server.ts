import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';

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
}
