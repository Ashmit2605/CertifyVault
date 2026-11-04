# CertifyVault Implementation Analysis

## Existing architecture

The repository is a modular-monolith project with a React website, an Express API, and a separate Expo mobile application. The issuance and verification API is in `Backend/server`; the issuer dashboard is in `Website`. The backend development plan and schema reference are in `Backend/backend.md` and `Backend/schema.md`. The two project-report PDFs named in the supplied implementation plan are not present in the repository.

## Actual technology stack

- Website: React 19, TypeScript, Vite, React Router, Clerk, Tailwind, Axios.
- API: Node.js ESM, TypeScript, Express 5, PostgreSQL, Drizzle ORM, Zod, Clerk session-token verification.
- Mobile: Expo / React Native; no certificate issuance API integration was found during this audit.
- Blockchain, PDF, QR, and private file-storage packages or implementation are not present in the backend.

## Backend module structure

The API currently has a single entry point, route/controller/service files for authentication, certificates, and verification, Clerk authentication and role middleware, and a Drizzle schema. The certificate service inserts user-provided certificate fields directly. The blockchain service is a placeholder. No job queue, audit-log module, template model, or certificate-file store exists.

## Frontend module structure

Issuer routes are already protected by `RequireAuth` and are nested under `IssuerDashLayout`. Existing screens include overview, certificate listing, issue/bulk issuance, templates, revocations, students, analytics, and audit logs. The issue wizard and certificate list use hard-coded sample data and simulated progress. The template editor keeps changes only in browser state.

## Database schema and relationships

The implemented Drizzle schema contains:

- `users`: Clerk ID, unique email, role, activation flag, and optional free-text institution name.
- `certificates`: unique certificate ID, student name, course, certificate hash, optional transaction hash, and issue timestamp.

The implementation does not have institution, student, template, blockchain-record, verification-history, revocation, or audit-log tables. The broader `Backend/schema.md` describes a proposed schema, not the current database. Migrations tracked in the repository create the two current tables. There is also a pre-existing, untracked `0000_silly_toad_men.sql`; it is not modified by this implementation.

## Authentication and authorization flow

The frontend obtains a Clerk session JWT and sends it as a bearer token. The API validates it with Clerk and stores the Clerk subject in `res.locals`. `requireRole` loads the corresponding database profile and checks activation and role. Issuer registration is initially inactive; only administrators can activate issuer accounts. This implementation keeps Clerk and the existing profile flow.

## Existing security mechanisms

The API uses Helmet, a CORS allowlist, request-size limiting, API rate limiting, Clerk token verification, Zod validation for account administration, and role middleware. However, the existing certificate route passes unchecked request data to the database; it trusts the caller-supplied hash and transaction hash. The read route is unauthenticated and returns the complete certificate row. Verification currently considers any matching certificate ID valid. No file authorization, integrity verification, QR signature, or audit trail exists.

## Blockchain implementation status

No Solidity contract, Hardhat setup, Ethers dependency, transaction configuration, or real blockchain integration exists. The existing service returns a constant zero transaction hash and success response. It must not be used as evidence of registration.

## Existing reusable components

The existing issuer shell, routes, form wizard, certificate list, badges, notifications styling, templates screens, Clerk auth helper, and backend role middleware can be extended. Existing API route conventions and the Drizzle schema/migration workflow will be retained.

## Missing functionality

- Validated certificate issuance owned by the active issuer.
- Generated PDF and signed QR verification URL.
- Final-file SHA-256 calculation and private storage.
- Real blockchain registration, confirmation, revocation, and failure handling.
- Authorized certificate listing, details, downloads, retries, and revocation.
- Public signature-based verification and current lifecycle checks.
- Persistent audit history and issuer statistics.
- Real issuer UI data and issuance progress.
- Tests for issuance, authorization, integrity, QR signatures, and blockchain behavior.

## Required database changes

Extend `certificates` instead of creating a duplicate. Preserve its existing primary key, certificate identifier, student/course/hash, transaction hash, and issue date. Add issuer ownership, academic and lifecycle data, private file metadata, QR token version, network/contract/block information, and transaction/registration state. Add a separate append-only audit table. Do not invent institution or student foreign keys that do not exist; issuer institution identity is currently represented by `users.institution_name`.

## Required backend APIs

Extend the certificate routes with validated issuer-only creation, scoped listing/details, authorized downloads, chain registration retry, and revocation. Keep verification public, but require a valid signed token and check the current database lifecycle status. Add issuer statistics and audit-history reads. Do not expose storage paths, signing keys, or the database row wholesale.

## Required frontend changes

Replace fake issuer certificate rows and simulated issuance with the API. Preserve the existing issuer dashboard and styling. Use the existing Clerk session token for authorized API calls, show actual pending/failure/confirmation states, and ensure the UI does not claim issuance before chain confirmation.

## Identified risks and implementation constraints

- A blockchain RPC endpoint, deployed contract address, registrar private key, and QR signing key are external configuration and are not present in the repository. No success will be simulated when they are missing.
- Local private-file storage is the documented MVP choice. Production deployments need a persistent private volume and suitable backup/retention controls; cloud object storage is not configured.
- The project has pre-existing uncommitted lockfile changes and an untracked migration. These are preserved.
- Supplied architecture PDFs are absent. The checked-in backend and schema documents are the available references.

## Implementation sequence

1. Extend the Drizzle certificate and audit schema and add a forward-only migration.
2. Implement certificate validation, ID generation, signed QR tokens, PDF creation, SHA-256, private file storage, blockchain registration, and audit recording.
3. Add scoped certificate, verification, dashboard, and revocation APIs with explicit failure states.
4. Wire the issuer issue and certificate-list pages to real APIs.
5. Add targeted tests and update backend setup/API documentation.

## Follow-up implementation in this working tree

The issuer-issued PDF QR now opens a permanent frontend route at `/credentials/:certificateId` using only the credential ID. The public API validates the signed proof retained in backend-managed certificate metadata, checks current credential status and the on-chain PDF digest when applicable, and returns only issuer-approved identifying metadata (title, institution, and issue date). No verification token appears in the public URL. Recipient details and original PDF access remain excluded from this public response. Existing PDFs and their QR URLs are unchanged.

The lifecycle implementation has since expanded beyond that original verification-page change. The backend now includes issuer-owned recipient records, email-attested claim invitations and an outbox worker, institution discovery and issuer review, explicit holder claim completion, a holder wallet, privacy settings and expiring share links, policy-checked public PDF access, persisted/idempotent CSV jobs, W3C VC 2.0 credentials with Data Integrity proof verification, and holder WebAuthn passkey management. New frontend routes and screens use these APIs.

The original repository-state descriptions above are the baseline analysis, not a description of the current tree. See [CERTIFYVAULT_IMPLEMENTATION_REPORT.md](./CERTIFYVAULT_IMPLEMENTATION_REPORT.md) for implemented scope, validation, and deployment prerequisites. Migrations remain unapplied; live PostgreSQL, chain, email-provider, and authenticator flows require deployment configuration and have not been tested in this environment.
