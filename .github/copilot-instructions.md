## Purpose

This file gives AI coding agents the focused, repository-specific knowledge needed to be productive quickly.

## Big picture
- **Monorepo split:** `backend/` (Node + Express + MongoDB) and `frontend/` (React + Vite + Chakra UI).
- **API surface:** Backend exposes REST endpoints under `/api/*` (see [backend/server.js](backend/server.js#L1)).
- **Data sources:** csv seed files live in `backend/data/` and utilities under `backend/utils/` parse/write CSVs (delimiter `;`).

## Key components & files (quick links)
- **DB connect:** [backend/config/bbdd.js](backend/config/bbdd.js#L1)
- **Auth:** [backend/utils/jwt.js](backend/utils/jwt.js#L1) + [backend/routes/Autenticacion.js](backend/routes/Autenticacion.js#L1) + [backend/middleware/autenticacion.js](backend/middleware/autenticacion.js#L1)
- **CSV helpers:** [backend/utils/leerCSV.js](backend/utils/leerCSV.js#L1) and `escribirCSV.js`
- **Routes / controllers:** `backend/routes/*.js` register Express routes; business logic lives in `backend/controllers/*.js`.
- **Frontend entry:** `frontend/src/main.jsx` and pages/components under `frontend/src/paginas` and `frontend/src/components`.

## Architecture & data flow notes
- Frontend calls backend REST endpoints (e.g., `/api/pedidos`); backend controllers interact with Mongoose models in `backend/models/`.
- Some features read/write CSV files for data import/export. CSV parsing uses `csv-parse/sync` with `delimiter: ';'` (see `leerCSV.js`).
- Auth is JWT-based: tokens created with `generateToken(payload)` and verified with `verifyToken(token)`. Protect routes with the `isAuth` middleware which expects `Authorization: Bearer <token>`.
- Roles are enforced via `isAdmin` and `isRol(roles)` in `backend/middleware/autenticacion.js` and `backend/utils/roles.js`.

## Developer workflows / commands
- Start backend (development):

  cd backend
  npm install
  npm run dev   # uses nodemon, runs server.js

- Start frontend (development):

  cd frontend
  npm install
  npm run dev   # starts Vite on port 5174 by default

- Environment variables (backend): set at least `MONGO_URL`, `JWT_SECRET`, and `FRONTEND_URL` (CORS origin). Default backend port is `PORT` or `4000`.

## Project-specific conventions and patterns
- Routes are simple Express routers in `backend/routes/` and delegate to controllers. When adding endpoints follow existing patterns: route -> controller -> model.
- Controllers tend to call utility functions for domain logic (e.g., `utils/generarNumeroPedido.js`), so prefer creating small utilities over bloated controller functions.
- CSV files use semicolon delimiters and are loaded with absolute project paths via `process.cwd()`; use `path.join(process.cwd(), filename)` when referencing data files.
- Passwords are hashed with `bcryptjs` and compared with `bcrypt.compare`. Token responses include a `usuario` object without the password.

## Integration points & external dependencies
- MongoDB via the `mongodb` / `mongoose` stack — connection string in `MONGO_URL`.
- Cloudinary-related middleware exists under `backend/middleware/` for file uploads; review `archivosCloudinary.js` before changing media upload flows.
- CSV generation / export uses `json2csv` and `csv-parse`.

## Examples agents should follow
- To add an authenticated endpoint:

  1. Add route in `backend/routes/*.js` and mount in `server.js`.
  2. Add controller in `backend/controllers/` that uses models in `backend/models/`.
  3. Protect with `isAuth` / `isRol` if needed.

- To run a quick local test of auth flow: POST to `/api/auth/login` with `{ email, password }`, then call `/api/auth/usuario` with header `Authorization: Bearer <token>`.

## What not to assume
- There are CSV-based seed flows and also a MongoDB-backed runtime; do not assume all data comes from the DB. Check `backend/utils/seeds/` and `backend/data/` for seed scripts.
- Frontend expects the backend CORS origin to match `FRONTEND_URL` in `.env`.

## Where to look first when troubleshooting
- Start `backend/server.js` logs for DB connection errors (`connectDB` in `backend/config/bbdd.js`).
- Check `backend/middleware/autenticacion.js` for token/role issues.
- If CSV read/write failures occur, inspect `backend/utils/leerCSV.js` and used file paths.

## If you change behavior
- Update or add a short note in `README.md` and, when API shapes change, update any dependent frontend files under `frontend/src/api`.

---
Please review sections that feel unclear or incomplete and tell me which area to expand (auth, CSV seeds, or frontend routing examples).
