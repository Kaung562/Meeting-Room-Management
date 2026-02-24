import bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';
import { Room } from '../entities/Room';

const SALT_ROUNDS = 10;
const SEED_ADMIN_USERNAME = 'admin123';
const SEED_ADMIN_PASSWORD = 'admin123';
const DEFAULT_ROOMS = ['GOLD', 'CLASSICAL', 'DIAMOND'] as const;

export async function seedAdmin(): Promise<void> {
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOne({ where: { username: SEED_ADMIN_USERNAME } });
  if (existing) return;

  const hashed = await bcrypt.hash(SEED_ADMIN_PASSWORD, SALT_ROUNDS);
  const admin = repo.create({
    username: SEED_ADMIN_USERNAME,
    password: hashed,
    name: 'Admin',
    role: 'ADMIN',
  });
  await repo.save(admin);
  console.log('Seed admin created: username=%s, id=%s', SEED_ADMIN_USERNAME, admin.id);
}

export async function seedRooms(): Promise<void> {
  const repo = AppDataSource.getRepository(Room);
  for (const roomName of DEFAULT_ROOMS) {
    const existing = await repo.findOne({ where: { name: roomName } });
    if (existing) continue;
    await repo.save(repo.create({ name: roomName }));
    console.log('Seed room created: name=%s', roomName);
  }
}
