import bcrypt from 'bcrypt';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';

const SALT_ROUNDS = 10;
const SEED_ADMIN_USERNAME = 'admin123';
const SEED_ADMIN_PASSWORD = 'admin123';

/**
 * Ensures the seed admin user exists (username: admin, password: admin123).
 * - If no user with username "admin" exists, creates one with role admin.
 * - Run after DB init (and after drop+recreate when DB_DROP_AND_CREATE=true).
 */
export async function seedAdmin(): Promise<void> {
  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOne({ where: { username: SEED_ADMIN_USERNAME } });
  if (existing) return;

  const hashed = await bcrypt.hash(SEED_ADMIN_PASSWORD, SALT_ROUNDS);
  const admin = repo.create({
    username: SEED_ADMIN_USERNAME,
    password: hashed,
    name: 'Admin',
    role: 'admin',
  });
  await repo.save(admin);
  console.log('Seed admin created: username=%s, id=%s', SEED_ADMIN_USERNAME, admin.id);
}
