import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Booking } from '../entities/Booking';
import { Room } from '../entities/Room';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = isProduction ? process.env.DATABASE_URL : undefined;

export const AppDataSource = new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        synchronize: true,
        dropSchema: false,
        logging: process.env.DB_LOGGING === 'true',
        entities: [User, Booking, Room],
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
        entities: [User, Booking, Room],
        migrations: [],
        subscribers: [],
      }
);
