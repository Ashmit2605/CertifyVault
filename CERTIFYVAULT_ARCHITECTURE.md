# CertifyVault Architecture

## Current application structure

CertifyVault is a modular monolith with a React/Vite website, an Express/TypeScript API, PostgreSQL with Drizzle ORM, Clerk authentication, private local PDF storage, and a Polygon-compatible EVM registry. Issuance, verification, and the issuer dashboard are implemented in the existing application; authentication and dashboard shells remain owned by their existing modules.

```text
Issuer dashboard
    |
    | authenticated issue request
    v
Express certificate service
    |-- renders final PDF with stable credential URL and stores signed proof
    |-- creates a W3C VC 2.0 credential and EdDSA RDFc Data Integrity proof
    |-- SHA-256 hashes and privately stores exact PDF bytes
    |-- persists certificate and audit event
    |-- registers PDF digest on Polygon through registrar wallet
    v
PostgreSQL certificate, recipient, claim, sharing, and import-job records
    + private PDF + VC proof + chain proof
    |
    +--> Public credential URL (ID only) --> signed proof + lifecycle + chain digest
    +--> Holder claim --> wallet --> privacy settings / revocable share links
    +--> Durable CSV job --> idempotent row issuance worker
    +--> Holder passkeys --> single-use WebAuthn challenges and authenticator counters
```

## Credential lifecycle currently implemented

1. An active issuer creates a certificate for a recorded recipient; the recipient does not need an existing CertifyVault account. The issuer may queue a claim invitation.
2. The API creates an issuer-bound verification proof and a W3C VC 2.0 credential with an issuer `did:key` and Data Integrity proof. It puts the stable credential URL in the PDF QR, hashes the final PDF, stores it privately, and creates a pending database record.
3. The backend submits the certificate ID and PDF digest to the configured registry. The record becomes issued only after the configured confirmation requirement succeeds; missing or failed chain configuration is represented as pending or failed.
4. The recipient explicitly claims the credential using a verified account email. Issuer-initiated invitations require token verification and account-email matching. Discovery requests require issuer review.
5. The stable public route `/credentials/:certificateId` displays minimized details and current verification state. The issuer proof remains backend-managed and is not placed in the public URL; it is not a claim token or ownership proof.
6. Claimed holders manage wallet access, display-name/export/PDF policy, and expiring revocable share links. The public API returns no PDF unless the holder's policy or a valid permitted share link authorizes it.
7. Issuer-only downloads enforce issuer ownership and verify the exact stored PDF hash. Revocation keeps the record and URL available so the page can report its current status.
8. CSV imports persist as jobs and per-row documents. A worker issues rows with a stable unique idempotency key and records row-level failures for recovery.

## Data and trust boundaries

- `users` holds the existing Clerk-linked accounts and issuer institution label.
- `certificates` holds issuer-owned certificate metadata, lifecycle state, PDF digest/storage key, QR verification URL, and chain references.
- `certificate_audit_logs` records backend-created certificate events.
- Recipient, claim/invitation, holder-sharing, share-link, bulk-job/document, W3C credential, and passkey tables persist the new lifecycle state.
- The PDF and database are off-chain. Only credential identifiers and digests are registered on-chain; student information and storage URLs are not.
- The public API returns only certificate title, institution name, issue date, ID, and verification indicators. It does not return student names, certificate numbers, enrollment data, emails, PDF bytes, or storage keys.
- Issuer proof, account authentication, and student ownership are distinct concerns. The backend-signed proof binds the credential ID to the issuer account and is validated by the API; it is not an issuer-controlled W3C credential proof or a student ownership proof.
- VC keys are configured per issuer in `VC_ISSUER_KEYS_JSON`; passkey ceremonies bind to the configured RP ID and frontend origins. Passkeys add verification to a Clerk-authenticated session and do not replace account recovery.

## Blockchain boundary and future hybrid support

The certificate service calls a blockchain service through a small registration/proof interface. Polygon Amoy is the development target. The registrar key, RPC URL, chain ID, contract address, and confirmation count are backend configuration only. A future permissioned ledger should be added behind this interface and its own transaction/reconciliation adapter; the certificate lifecycle and PDF generation should not depend on a particular chain. No Fabric or hybrid consensus is implemented.

## Remaining boundaries

The lifecycle services and user flows are implemented, but database migrations must still be reviewed and applied in each deployment, and issuer VC keys, invitation email delivery, storage, Clerk, and blockchain integrations must be configured. This environment has not exercised live database, chain, email, or browser-authenticator flows. Bulk CSV supports metadata rows; PDF splitting and OCR review are not implemented. Passkeys are additional holder verification, not Clerk login replacement. Selective-disclosure presentations, external verifier exchange, mobile-app integration, and permissioned/hybrid consensus remain out of scope. Public verification still does not imply ownership or PDF access.
