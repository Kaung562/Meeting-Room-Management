import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { ResponseError } from '../errorHandlers/ResponseError';
import { UserErrors, AuthErrors } from '../constants/errors';
import type { UserRole } from '../entities/User';

const SALT_ROUNDS = 10;
const VALID_ROLES: UserRole[] = ['ADMIN', 'OWNER', 'USER'];

function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== 'string') return null;
  const normalized = role.trim().toUpperCase();
  if (!VALID_ROLES.includes(normalized as UserRole)) return null;
  return normalized as UserRole;
}

export function getUserRepo() {
  return AppDataSource.getRepository(User);
}

export async function findUserById(id: number): Promise<User | null> {
  return getUserRepo().findOne({ where: { id } });
}

export async function findUserByUsername(username: string, withPassword = false): Promise<User | null> {
  const repo = getUserRepo();
  const normalizedUsername = username.trim();
  if (withPassword) {
    const row = await repo
      .createQueryBuilder('user')
      .where('user.username = :username', { username: normalizedUsername })
      .addSelect('user.password')
      .getOne();
    return row;
  }
  return repo.findOne({ where: { username: normalizedUsername } });
}

export async function getUsers(): Promise<User[]> {
  return getUserRepo().find({ order: { name: 'ASC' } });
}

export async function validateUserExists(id: number): Promise<User> {
  const user = await findUserById(id);
  if (!user) throw new ResponseError(404, UserErrors.NOT_FOUND);
  return user;
}

export async function createUser(data: {
  username: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<User> {
  const username = typeof data.username === 'string' ? data.username.trim() : '';
  const password = typeof data.password === 'string' ? data.password : '';
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!username) throw new ResponseError(400, UserErrors.USERNAME_REQUIRED);
  if (!password) throw new ResponseError(400, UserErrors.PASSWORD_REQUIRED);
  if (!name) throw new ResponseError(400, UserErrors.NAME_REQUIRED);
  const normalizedRole = normalizeRole(data.role);
  if (!normalizedRole) {
    throw new ResponseError(400, UserErrors.ROLE_INVALID);
  }
  const existing = await findUserByUsername(username);
  if (existing) throw new ResponseError(400, UserErrors.USERNAME_TAKEN);

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = getUserRepo().create({
    username,
    password: hashed,
    name,
    role: normalizedRole,
  });
  return getUserRepo().save(user);
}

export async function updateUserRole(id: number, role: UserRole): Promise<User> {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) {
    throw new ResponseError(400, UserErrors.ROLE_INVALID);
  }
  const user = await validateUserExists(id);
  user.role = normalizedRole;
  return getUserRepo().save(user);
}

/**
 * Delete user. System behavior: all bookings created by this user are deleted (CASCADE).
 */
export async function deleteUser(id: number, currentUserId: number): Promise<void> {
  if (id === currentUserId) throw new ResponseError(400, UserErrors.CANNOT_DELETE_SELF);
  const user = await validateUserExists(id);
  await getUserRepo().remove(user);
}

export async function verifyLogin(username: string, password: string): Promise<User> {
  const user = await findUserByUsername(username, true);
  if (!user || !user.password) throw new ResponseError(401, AuthErrors.INVALID_CREDENTIALS);
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ResponseError(401, AuthErrors.INVALID_CREDENTIALS);
  const { password: _p, ...safe } = user;
  return safe as User;
}
