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

Create a `.env` file in the root of this folder with:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/certificate_db
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=
JWT_SECRET=your_secret
```

> Do not commit `.env` to source control.

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
- `POST /api/auth/login` — authentication placeholder
- `POST /api/certificates/issue` — issue a new certificate
- `GET /api/certificates/:certificateId` — get a certificate by ID
- `POST /api/verification` — verify a certificate

## Notes

- This backend uses Node ESM and explicit `.js` file extensions for imports.
- The server is intentionally structured to keep blockchain logic in service layers rather than routes.
