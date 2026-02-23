# Meeting Room Booking System

A small web app for managing bookings for a single meeting room, with role-based access (Admin, Owner, User).

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

3. Open http://localhost:5173. **Log in** with username and password (default seed admin: **admin** / **admin123**). Then create other users in **User Management**, and create/view/delete bookings. Admins can open **User Management**; Owners and Admins can open **Usage Summary**.

## Stack

- **Backend:** Node.js, TypeScript, Express, TypeORM, PostgreSQL
- **Frontend:** Pure React (TypeScript), no Redux/Router/state libs — React + React DOM only; built with Vite
- **Auth:** Header `x-user-id` (demo only; not production-grade)

## Roles and permissions

| Action | User | Owner | Admin |
|--------|------|-------|-------|
| Create booking | ✓ | ✓ | ✓ |
| View all bookings | ✓ | ✓ | ✓ |
| Delete own booking | ✓ | ✓ | ✓ |
| Delete any booking | ✗ | ✓ | ✓ |
| Usage summary (grouped by user) | ✗ | ✓ | ✓ |
| List / create / delete users | ✗ | ✗ | ✓ |
| Change user roles | ✗ | ✗ | ✓ |

**User deletion:** When an admin deletes a user, all bookings created by that user are removed.

## Time and overlap rules

- Times are **ISO 8601** (UTC). Stored and compared consistently.
- **Overlap:** Slots are half-open `[start, end)`. Back-to-back bookings (one’s end = next’s start) are allowed.
- Invalid requests (e.g. start ≥ end, overlapping slot) return clear 400 error messages.

## API (summary)

- `GET /api/users/me` — Current user (any role)
- `GET/POST /api/users` — List / create users (admin)
- `PATCH /api/users/:id/role` — Change role (admin)
- `DELETE /api/users/:id` — Delete user (admin)
- `GET /api/bookings` — List bookings
- `POST /api/bookings` — Create booking (body: `startTime`, `endTime`)
- `DELETE /api/bookings/:id` — Delete booking (permission enforced)
- `GET /api/summary` — Usage summary by user (owner, admin)

Protected routes require header: `x-user-id: <userId>`. The frontend uses `GET /api/users/demo` (no auth) to populate the login dropdown.

## Seed and fresh DB

- One **admin** user is created on first run: username **admin**, password **admin123**. The admin creates all other users via the app.
- To **clear all data and recreate tables**: set `DB_DROP_AND_CREATE=true` in `backend/.env`, start the backend once, then set it back to `false` (or leave `true` to always drop on every start).

## Deploy on Render

1. Push this repo to GitHub and connect it to [Render](https://render.com).
2. In the Render Dashboard: **New → Blueprint**. Connect the repo and use the `render.yaml` at the repo root. Deploy.
3. After the first deploy:
   - Open the **Static Site** service (e.g. `meeting-room-booking-web`).
   - **Environment** → add or edit: `VITE_API_URL` = your Backend URL (e.g. `https://meeting-room-booking-api.onrender.com`). No trailing slash.
   - Trigger a new deploy of the Static Site so the frontend is built with the correct API URL.
4. Open the frontend URL and log in with the seed admin: **admin** / **admin123**.
