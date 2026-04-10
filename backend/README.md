# Bazario API (Express + MySQL)

## Prerequisites

- MySQL server with database `bazario` and user (e.g. `bazario_user`).
- Root `.env` at project root (`bazario/.env`) **or** `backend/.env` with:

```env
DB_HOST=localhost
DB_USER=bazario_user
DB_PASSWORD=password123
DB_NAME=bazario
JWT_SECRET=bazario_01
PORT=5000
```

## Setup

From `backend/`:

```bash
npm install
npm run migrate
npm run seed
npm start
```

- **migrate**: applies `sql/schema.sql` to the database.
- **seed**: clears core tables and inserts demo sellers, buyer, and catalog products (IDs 1–8 matching the frontend catalog).

## Test accounts (after seed)

| Role   | Email              | Password    |
|--------|--------------------|------------|
| Buyer  | buyer@bazario.com  | password123 |
| Seller | seller@bazario.com | password123 |

## API

- `GET /health` — health check
- `GET /api/buyer/test` — buyer route smoke test (JSON)
- `GET /api/seller/test` — seller route smoke test (JSON)
- `POST /api/auth/buyer/login` — `{ "email", "password" }`
- `POST /api/auth/seller/login` — `{ "email", "password" }`

Authenticated routes use header: `Authorization: Bearer <token>`.

Frontend: set `VITE_API_URL=http://localhost:5000` in the root `.env` for the Vite app.
