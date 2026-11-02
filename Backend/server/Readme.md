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
- Issuer-scoped certificate issuance, listings, downloads, retries, and revocation
- Final-PDF SHA-256, Ed25519-signed QR tokens, and private local file storage
- Polygon Amoy-compatible Solidity registry and transaction confirmation tracking
- Backend-generated certificate audit records

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

The website also needs `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL=http://localhost:5000/api`, and optionally `VITE_BLOCKCHAIN_EXPLORER_URL` for transaction links.

Certificate issuance requires the following additional backend configuration:

- `CERTIFICATE_STORAGE_PATH`: private, persistent local directory for generated PDFs. It is not served as static content.
- `PUBLIC_VERIFICATION_URL`: public HTTPS base URL for `/api/verification` (HTTP is accepted only for localhost).
- `CERTIFICATE_QR_KEY_ID`, `CERTIFICATE_QR_PRIVATE_KEY_BASE64`, and `CERTIFICATE_QR_PUBLIC_KEYS`: Ed25519 signing and verification keys. Keep the private key only on the backend; the JSON public-key map can retain older IDs during key rotation.
- `BLOCKCHAIN_NETWORK`, `BLOCKCHAIN_CHAIN_ID`, `BLOCKCHAIN_RPC_URL`, `BLOCKCHAIN_CONTRACT_ADDRESS`, `BLOCKCHAIN_PRIVATE_KEY`, and `BLOCKCHAIN_CONFIRMATIONS`: registrar integration configuration. For Polygon Amoy, use chain ID `80002`. The registrar key must have testnet gas.

Generate a signing key pair locally and configure the resulting Base64 DER strings in the backend environment (do not commit them):

```powershell
node -e "const {generateKeyPairSync}=require('node:crypto'); const k=generateKeyPairSync('ed25519',{privateKeyEncoding:{type:'pkcs8',format:'der'},publicKeyEncoding:{type:'spki',format:'der'}}); console.log(JSON.stringify({privateKey:k.privateKey.toString('base64'),publicKey:k.publicKey.toString('base64')}))"
```

Set `CERTIFICATE_QR_PUBLIC_KEYS` to a JSON object such as `{"v1":"<public-key-base64>"}`. Use the same key ID in `CERTIFICATE_QR_KEY_ID`.

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
- `GET /api/auth/admin/accounts?role=issuer|verifier` — list issuer or verifier accounts for administrator review (admin only)
- `PATCH /api/auth/users/:clerkId/activation` — activate/deactivate an account (admin only); accepts `{ "isActive": boolean }`
- `POST /api/certificates/issue` — create and register a certificate (active issuer only); returns the actual lifecycle state
- `GET /api/certificates` — issuer-scoped search, status filter, and pagination
- `GET /api/certificates/:certificateId` — issuer-scoped details
- `GET /api/certificates/:certificateId/download` — authorized download with SHA-256 integrity verification
- `POST /api/certificates/:certificateId/registration/retry` — retry or reconcile a pending/failed registration
- `POST /api/certificates/:certificateId/revoke` — issuer-scoped revocation with a required reason
- `GET /api/issuer/dashboard/stats` and `GET /api/issuer/audit-logs` — actual issuer data
- `GET /api/verification/:certificateId?token=...` and `POST /api/verification` with `{ "certificateId": "...", "token": "..." }` — signed-token, lifecycle, and on-chain verification
- `GET /api/blockchain/health` — restricted to administrators

The issued PDF is finalized with its QR before SHA-256 is calculated. Files remain private on local disk, and downloads are authorized by issuer ownership and checked against the stored hash. A certificate becomes `issued` only after a successful configured-chain confirmation. Missing RPC/key/contract settings result in a visible failed or pending registration state; no success-shaped placeholder transaction is returned.

The frontend waits until Clerk reports an active session before requesting its session JWT and calling the API. It sends tokens using `Authorization: Bearer <token>`. The API validates them with `CLERK_SECRET_KEY` and the configured allowed frontend origins, obtains the user's canonical email and name from Clerk, and stores the Clerk user ID in the PostgreSQL `users` table. Passwords, email verification, OAuth, and reset codes stay with Clerk and are never stored by this API. A user's role is assigned only when their profile is first created and cannot be changed by later registration requests. New issuer and verifier accounts remain inactive until an administrator activates them; only active accounts can access their dashboards and protected API routes, and only active issuers can issue certificates. Admin accounts must be provisioned by a trusted operator and cannot be self-registered.

After changing the Drizzle schema, generate and apply the database migration:

```bash
npm run db:generate
npm run db:migrate
```

## Notes

- This backend uses Node ESM and explicit `.js` file extensions for imports.
- The server is intentionally structured to keep blockchain logic in service layers rather than routes.
- Apply the committed forward migration with `npm run db:migrate` after configuring PostgreSQL.
- Compile and test the registry locally with `npm run compile:blockchain` and `npm run test:blockchain`; run service tests with `npm test`.
- Deploy to the configured test network with `npm run deploy:blockchain`, then set the printed address as `BLOCKCHAIN_CONTRACT_ADDRESS`. The deployment account is the contract owner and initial registrar. If using a separate backend registrar, authorize it from the owner account using `setRegistrar`.
- Hardhat loads `Backend/server/.env` for blockchain commands. Before deployment, set `BLOCKCHAIN_RPC_URL` to a Polygon Amoy RPC endpoint and `BLOCKCHAIN_PRIVATE_KEY` to a funded test wallet key; the deployment script checks the key format and confirms the RPC chain ID matches `BLOCKCHAIN_CHAIN_ID`. Never share or commit the private key. Use a supported Node.js LTS release for Hardhat.
- Local filesystem storage is an MVP. Production requires a persistent, access-controlled volume, backups, and appropriate retention. Configure HTTPS for public QR verification and retain old QR public keys during key rotation.
- Bulk CSV issuance is currently processed as independent records in batches capped at 50; durable background jobs for large batches are not included.
