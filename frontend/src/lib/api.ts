import type { User, Booking, UserSummaryItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

function headers(userId: number | undefined): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (userId != null) h['x-user-id'] = String(userId);
  return h;
}

export async function login(username: string, password: string): Promise<User> {
  const r = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = (await r.json().catch(() => ({}))) as { error?: string; user?: User };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.user!;
}

export async function getMe(userId: number): Promise<User> {
  const r = await fetch(`${API_BASE}/users/me`, { headers: headers(userId) });
  const data = (await r.json().catch(() => ({}))) as { error?: string; user?: User };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.user!;
}

export async function getUsers(userId: number): Promise<User[]> {
  const r = await fetch(`${API_BASE}/users`, { headers: headers(userId) });
  const data = (await r.json().catch(() => ({}))) as { error?: string; users?: User[] };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.users ?? [];
}

export async function createUser(
  userId: number,
  payload: { username: string; password: string; name: string; role: string }
): Promise<User> {
  const r = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: headers(userId),
    body: JSON.stringify(payload),
  });
  const data = (await r.json().catch(() => ({}))) as { error?: string; user?: User };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.user!;
}

export async function updateUserRole(userId: number, id: number, role: string): Promise<User> {
  const r = await fetch(`${API_BASE}/users/${id}/role`, {
    method: 'PATCH',
    headers: headers(userId),
    body: JSON.stringify({ role }),
  });
  const data = (await r.json().catch(() => ({}))) as { error?: string; user?: User };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.user!;
}

export async function deleteUser(userId: number, id: number): Promise<void> {
  const r = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: headers(userId) });
  if (r.status === 404 || r.status === 400) {
    const data = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `HTTP ${r.status}`);
  }
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function getBookings(userId: number): Promise<Booking[]> {
  const r = await fetch(`${API_BASE}/bookings`, { headers: headers(userId) });
  const data = (await r.json().catch(() => ({}))) as { error?: string; bookings?: Booking[] };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.bookings ?? [];
}

export async function createBooking(
  userId: number,
  payload: { startTime: string; endTime: string }
): Promise<Booking> {
  const r = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: headers(userId),
    body: JSON.stringify(payload),
  });
  const data = (await r.json().catch(() => ({}))) as { error?: string; booking?: Booking };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.booking!;
}

export async function deleteBooking(userId: number, id: number): Promise<void> {
  const r = await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE', headers: headers(userId) });
  if (r.status === 403 || r.status === 404) {
    const data = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `HTTP ${r.status}`);
  }
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function getSummary(userId: number): Promise<UserSummaryItem[]> {
  const r = await fetch(`${API_BASE}/summary`, { headers: headers(userId) });
  const data = (await r.json().catch(() => ({}))) as { error?: string; summary?: UserSummaryItem[] };
  if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data.summary ?? [];
}
