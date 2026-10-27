# Backend Server

This backend folder contains the Express server for the CertifyVault project.
It uses TypeScript, Drizzle ORM, PostgreSQL, and a clean service/controller router architecture.

## Project Structure

```
server/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── certificate.routes.ts
│   │   └── verification.routes.ts
│   ├── controllers/
│   │   ├── certificate.controller.ts
│   │   └── verification.controller.ts
│   ├── services/
│   │   ├── certificate.service.ts
│   │   ├── blockchain.service.ts
│   │   └── verification.service.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── migrations/
│   └── middleware/
│       └── auth.middleware.ts
├── drizzle.config.ts
├── package.json
├── tsconfig.json
└── .env
```

## Features

- Express API server with JSON body parsing and CORS support
- PostgreSQL connection via Drizzle ORM
- Separate route, controller, service, and middleware layers
- Drizzle migration configuration and SQL schema support
- Example certificate and verification routes

## Environment Variables

Copy `.env.example` to `.env` in this folder and provide your local PostgreSQL connection string and Clerk **secret** key. Set the website's `VITE_CLERK_PUBLISHABLE_KEY` in `Website/.env.local`. Both Clerk keys must belong to the same Clerk application/environment. Set `FRONTEND_URL` to the exact website origin (scheme + host + port, no path); add more origins in `CLERK_AUTHORIZED_PARTIES` as a comma-separated list. Never put Clerk secret keys in the frontend.

```env
PORT=5000
CLERK_SECRET_KEY=sk_test_your_secret_key_here
FRONTEND_URL=http://localhost:5173
CLERK_AUTHORIZED_PARTIES=http://localhost:5173
DATABASE_URL=postgresql://postgres:password@localhost:5432/certificate_db
```

> Do not commit `.env` to source control.

The website also needs `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL=http://localhost:5000/api`.

## Installation

```bash
cd Backend/server
npm install
```

## Local Development

```bash
npm run dev
```

The server will start and listen on the port defined in `.env` or `5000` by default.

## Build and Run

```bash
npm run build
npm start
```

## Database / Drizzle

Generate a migration from schema changes:

```bash
npm run db:generate
```

Apply migrations to PostgreSQL:

```bash
npm run db:migrate
```

Push schema changes directly (use with caution):

```bash
npm run db:push
```

## API Endpoints

- `GET /api/health` — health check
- `POST /api/auth/register` — create a profile for an authenticated Clerk account; accepts `role` (`issuer`, `holder`, or `verifier`) and requires `institutionName` for issuer accounts
- `GET /api/auth/me` — return the authenticated user's active profile
- `PATCH /api/auth/users/:clerkId/activation` — activate/deactivate an account (admin only); accepts `{ "isActive": boolean }`
- `POST /api/certificates/issue` — issue a new certificate (requires an authenticated issuer or admin)
- `GET /api/certificates/:certificateId` — get a certificate by ID
- `POST /api/verification` — verify a certificate

The frontend waits until Clerk reports an active session before requesting its session JWT and calling the API. It sends tokens using `Authorization: Bearer <token>`. The API validates them with `CLERK_SECRET_KEY` and the configured allowed frontend origins, obtains the user's canonical email and name from Clerk, and stores the Clerk user ID in the PostgreSQL `users` table. Passwords, email verification, OAuth, and reset codes stay with Clerk and are never stored by this API. A user's role is assigned only when their profile is first created and cannot be changed by later registration requests. New issuer accounts remain inactive until an administrator activates them; only active issuers can issue certificates. Admin accounts must be provisioned by a trusted operator and cannot be self-registered.

After changing the Drizzle schema, generate and apply the database migration:

```bash
npm run db:generate
npm run db:migrate
```

## Notes

- This backend uses Node ESM and explicit `.js` file extensions for imports.
- The server is intentionally structured to keep blockchain logic in service layers rather than routes.
