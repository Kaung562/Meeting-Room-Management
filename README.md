# Meeting Room Booking System

A web app for managing bookings across multiple meeting rooms, with role-based access (`ADMIN`, `OWNER`, `USER`).

## Quick start

**Project layout:** `Meeting-Room-Booking-VS-One/` has two folders: `backend/` and `frontend/`. Run commands from the paths below.

1. **Backend** (Terminal 1)

   Create a PostgreSQL database, then copy `backend/.env.example` to `backend/.env` and set your DB credentials. From the **project root**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
  API runs at http://localhost:3001. On first run, one **seed admin** user is created; the admin then creates other users via the app.

2. **Frontend** (Terminal 2)

   From the **project root** (if you're in `backend/`, run `cd ..` first):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs at http://localhost:5173.
   App runs at http://localhost:5173 and proxies `/api` to the backend.

3. Open http://localhost:5173. **Log in** with username and password (default seed admin: **admin123** / **admin123**). Then create other users in **User Management**, and create/view/delete bookings.  
   - Booking creation requires selecting a meeting room.
   - Admins can open **User Management**.
   - Owners and Admins can open **Usage Summary**.

## Stack

- **Backend:** Node.js, TypeScript, Express, TypeORM, PostgreSQL
- **Frontend:** Pure React (TypeScript), no Redux/Router/state libs — React + React DOM only; built with Vite
- **Auth:** Header `x-user-id` (demo only; not production-grade)

## Roles and permissions

| Action | USER | OWNER | ADMIN |
|--------|------|-------|-------|
| Create booking | ✓ | ✓ | ✓ |
| View all bookings | ✓ | ✓ | ✓ |
| Delete own booking | ✓ | ✓ | ✓ |
| Delete any booking | ✗ | ✓ | ✓ |
| Usage summary (grouped by user) | ✗ | ✓ | ✓ |
| List / create / delete users | ✗ | ✗ | ✓ |
| Change user roles | ✗ | ✗ | ✓ |

**User deletion flow:** If an admin deletes a user who has bookings, UI shows a warning/confirmation first. If confirmed, current behavior applies: user is deleted and their bookings are removed.

## Time and overlap rules

- Times are **ISO 8601** (UTC). Stored and compared consistently.
- **Overlap:** Slots are half-open `[start, end)`. Back-to-back bookings (one’s end = next’s start) are allowed.
- Invalid requests (e.g. start ≥ end, overlapping slot) return clear 400 error messages.

## API (summary)

- `GET /api/users/me` — Current user (any role)
- `GET/POST /api/users` — List / create users (`ADMIN`)
- `PATCH /api/users/:id/role` — Change role (`ADMIN`)
- `DELETE /api/users/:id` — Delete user (`ADMIN`)
- `GET /api/bookings` — List bookings
- `GET /api/rooms` — List available meeting rooms
- `POST /api/bookings` — Create booking (body: `roomId`, `startTime`, `endTime`)
- `DELETE /api/bookings/:id` — Delete booking (permission enforced: USER own-only, OWNER/ADMIN any)
- `GET /api/summary` — Usage summary by user (OWNER, ADMIN). Includes room name per booking.

Protected routes require header: `x-user-id: <userId>`.

## Seed and fresh DB

- One **admin** user is created on first run: username **admin123**, password **admin123**. The admin creates all other users via the app.
- Seed meeting rooms are created on startup.

## Deployment

- Backend API is deployed on **Render**.
- Frontend is deployed on **Render**.
- PostgreSQL database is hosted on **Neon**.
- Frontend URL: **https://fe-mt-room-booking.onrender.com**
- Backend URL: **https://be-mt-room-booking.onrender.com**
- Default seed admin credentials:
      username - **admin123**
      password - **admin123**
