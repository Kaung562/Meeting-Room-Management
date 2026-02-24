# Meeting Room Booking — Backend API

- **Stack:** Node.js, TypeScript, Express, TypeORM, PostgreSQL
- **Port:** 3001 (or `PORT` env)
- **Auth:** Login with username/password; then send `x-user-id` (integer) on every protected request.

## Setup

1. Create a PostgreSQL database (e.g. `meeting_room_booking`).
2. Copy `.env.example` to `.env` and set `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, etc.
3. **Fresh DB (drop and recreate all tables):** set `DB_DROP_AND_CREATE=true` in `.env`, run once, then set back to `false` if you want to keep data.
4. Install and run:
   ```bash
   npm install
   npm run build && npm start
   ```
   Or for development: `npm run dev`.

On first run, the app creates tables and **seeds one admin user** if no admin exists:
- **Username:** `admin123`
- **Password:** `admin123`

The admin creates all other users via the app (User Management).

## IDs

- **User id** and **Booking id** are **auto-increment integers** (not UUIDs).

## Time handling

- All times are **ISO 8601** (UTC). Stored as `timestamptz` in PostgreSQL.
- **Overlap rule:** Slots are half-open `[start, end)`. Back-to-back bookings are **allowed**.

## User deletion

When an admin deletes a user, **all bookings created by that user are deleted** (CASCADE).

## API

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| GET | /api/health | - | - | Health check |
| POST | /api/auth/login | - | - | Login; body: `{ username, password }`; returns `{ user: { id, username, name, role } }` |
| GET | /api/users/me | yes | any | Current user |
| GET | /api/users | yes | admin | List users |
| POST | /api/users | yes | admin | Create user (body: username, password, name, role) |
| PATCH | /api/users/:id/role | yes | admin | Change user role |
| DELETE | /api/users/:id | yes | admin | Delete user (and their bookings) |
| GET | /api/bookings | yes | any | List all bookings |
| POST | /api/bookings | yes | any | Create booking (startTime, endTime) |
| DELETE | /api/bookings/:id | yes | user/owner/admin | Delete (user: own only) |
| GET | /api/summary | yes | owner, admin | Bookings grouped by user, usage summary |

Protected routes require header: `x-user-id: <integer>` (the logged-in user’s id).

## Project structure

- `config/` — DataSource (TypeORM), seed
- `constants/` — Error messages
- `entities/` — User (username, password, name, role), Booking
- `errorHandlers/` — ResponseError
- `middlewares/` — errorHandler, authMiddleware, asyncHandler
- `controllers/` — auth, user, booking, summary
- `services/` — userService, bookingService, summaryService
- `routes/` — authRoutes, userRoutes, bookingRoutes, summaryRoutes
