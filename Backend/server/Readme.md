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
- Final-PDF SHA-256, Ed25519-signed issuance proofs, and private local file storage
- Holder claims, recipient records, invitation outbox delivery, privacy controls, and revocable share links
- W3C Verifiable Credential Data Model 2.0 credentials with EdDSA RDFc 2022 Data Integrity proofs
- Durable, idempotent CSV import jobs processed by a background worker
- WebAuthn passkey registration, authentication, and authenticator revocation for holder step-up verification
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
- `PUBLIC_CREDENTIAL_URL`: public HTTPS website origin used to generate permanent `/credentials/:certificateId` links (HTTP is accepted only for localhost). It defaults to the first origin in `FRONTEND_URL`.
- `PUBLIC_VERIFICATION_URL`: public HTTPS base for backend-stored signed verification proofs and legacy direct-verification QR links. New PDFs use `PUBLIC_CREDENTIAL_URL` for their QR page.
- `CERTIFICATE_QR_KEY_ID`, `CERTIFICATE_QR_PRIVATE_KEY_BASE64`, and `CERTIFICATE_QR_PUBLIC_KEYS`: Ed25519 signing and verification keys. Keep the private key only on the backend; the JSON public-key map can retain older IDs during key rotation.
- `VC_ISSUER_KEYS_JSON`: issuer-ID keyed JSON objects containing `publicKeyMultibase` and `secretKeyMultibase`. Each new credential is issued as a VC Data Model 2.0 JSON-LD credential with an `eddsa-rdfc-2022` proof and a self-resolving `did:key` issuer. Keep private multibase keys only in a secret manager; never reuse the QR signing key. Every active issuer that issues credentials must have its own entry.
- `BLOCKCHAIN_NETWORK`, `BLOCKCHAIN_CHAIN_ID`, `BLOCKCHAIN_RPC_URL`, `BLOCKCHAIN_CONTRACT_ADDRESS`, `BLOCKCHAIN_PRIVATE_KEY`, and `BLOCKCHAIN_CONFIRMATIONS`: registrar integration configuration. For Polygon Amoy, use chain ID `80002`. The registrar key must have testnet gas.
- `PASSKEY_RP_ID`: WebAuthn relying-party domain (use `localhost` for local development and the exact registrable website domain in production). `FRONTEND_URL` supplies the exact allowed origins.
- `EMAIL_API_URL`, `EMAIL_API_KEY`, and `EMAIL_FROM`: email REST-provider settings used by the durable claim-invitation outbox. The worker remains disabled until all three are configured.

New PDF QR codes open the stable public credential page using only the credential ID. The signed issuer-bound verification proof remains in backend-managed certificate metadata and is checked by the public API; no verification or claim token appears in the public URL. Existing PDFs keep their previously generated QR URLs. The public page validates the proof, lifecycle state, and chain proof when applicable; it returns only the credential title, issuer institution, issue date, and verification state. It does not expose recipient details or grant access to the private PDF.

Generate a signing key pair locally and configure the resulting Base64 DER strings in the backend environment (do not commit them):

```powershell
node -e "const {generateKeyPairSync}=require('node:crypto'); const k=generateKeyPairSync('ed25519',{privateKeyEncoding:{type:'pkcs8',format:'der'},publicKeyEncoding:{type:'spki',format:'der'}}); console.log(JSON.stringify({privateKey:k.privateKey.toString('base64'),publicKey:k.publicKey.toString('base64')}))"
```

Set `CERTIFICATE_QR_PUBLIC_KEYS` to a JSON object such as `{"v1":"<public-key-base64>"}`. Use the same key ID in `CERTIFICATE_QR_KEY_ID`.

Generate a new VC key pair with the installed Multikey library and assign it to the matching database issuer ID. Run this only in a trusted terminal; protect the printed secret and place it in a secret manager rather than source control:

```powershell
node --input-type=module -e "import * as E from '@digitalbazaar/ed25519-multikey'; const key=await E.generate(); console.log(JSON.stringify(await key.export({publicKey:true,secretKey:true})))"
```

`VC_ISSUER_KEYS_JSON` example shape (replace the database ID and both key values):

```json
{"42":{"publicKeyMultibase":"z6Mk...","secretKeyMultibase":"z..."}}
```

Passkey options and verification are bound to `PASSKEY_RP_ID`, allowed `FRONTEND_URL` origins, five-minute single-use challenges, user verification, and monotonic authenticator counters. Passkeys provide an additional verification ceremony for a currently signed-in holder; they do not replace Clerk sign-in or account recovery. Losing all passkeys is recovered through the account provider, after which lost authenticators can be revoked in the holder security settings.

Bulk CSV import is stored as an idempotent job and per-row documents before processing. The worker retries stale `issuing` rows safely using a unique document-to-certificate idempotency key and reports row-specific validation/issuance errors. It handles CSV metadata only; PDF splitting and OCR are not supported.

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

Run these commands from `Backend/server`, where the backend `.env` and `package.json` are located. `db:generate` creates a SQL migration but does not apply it; `db:migrate` applies pending migrations to the PostgreSQL database selected by `DATABASE_URL`.

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
- `GET|POST /api/issuer/recipients`, `POST /api/issuer/recipients/:id/verify-contact` — issuer-scoped recipient records and explicit contact attestations
- `GET /api/issuer/claim-requests`, `POST /api/issuer/claim-requests/:id/decision` — review institution-discovery requests
- `POST|GET|DELETE /api/issuer/credentials/:id/invitations` — queue, inspect, and revoke claim invitations
- `POST /api/issuer/import-jobs`, `GET /api/issuer/import-jobs/:id` — create and inspect durable bulk jobs
- `GET /api/me/credentials`, `GET /api/me/credentials/:id`, `GET /api/me/credentials/:id/pdf`, and `GET /api/me/credentials/:id/export` — claimed-holder wallet and owner-only document/export access
- `PATCH /api/me/credentials/:id/sharing`, `POST|GET /api/me/credentials/:id/share-links`, `DELETE /api/me/credentials/:id/share-links/:linkId` — holder privacy and link controls
- `POST /api/credentials/discover`, `POST /api/credential-claims/verify-token`, `POST /api/credential-claims/complete` — claim discovery and explicit invitation claim completion
- `GET /api/me/passkeys`, registration/authentication options and verification routes, and `DELETE /api/me/passkeys/:id` — passkey lifecycle for holders
- `GET /api/public/credentials/:publicId` — minimized public credential details after signed proof, lifecycle, and applicable chain-proof verification
- `GET /api/public/credentials/:publicId/download?share=...` — policy-checked PDF download, only when public policy or a permitted share link allows it
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
