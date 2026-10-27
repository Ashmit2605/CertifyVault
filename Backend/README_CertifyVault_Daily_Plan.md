# CertifyVault --- Daily Implementation Checklist

> **Purpose:** Implement CertifyVault in dependency order, with each day
> planned for approximately **one focused human-hour**.
>
> **Current status:** Frontend is complete, login/authentication backend
> is complete, and the database connection is working. Therefore, this
> plan starts with **dashboard functionality**, not login
> implementation.
>
> **How to use this file:** Complete the checklist for a day, test the
> outcome, then mark it done. If a task takes more than one hour, split
> it into smaller subtasks rather than rushing the implementation.

## Project flow

1.  User signs in and is routed to the correct role dashboard.
2.  Issuer/institution prepares certificate data and issues a
    certificate.
3.  System stores certificate metadata and file, generates a SHA-256
    hash, and creates a signed QR verification token.
4.  System registers the hash and status on the configured blockchain
    network.
5.  Holder sees the issued certificate, downloads it, and shares its
    QR/verification link.
6.  Verifier scans the QR or uploads a PDF, scan, or photograph.
7.  Backend creates a verification job; document preprocessing and OCR
    extract relevant fields.
8.  Verification checks institutional records, QR token, blockchain
    record, and available image/signature/logo signals.
9.  System computes a trust score, maps it to a risk category, saves the
    result, and generates a downloadable report.
10. Suspicious results can be referred to the institution for manual
    review; issuers/admins can revoke certificates and the system
    records the status change.

## Important implementation rules

- **Do not rebuild completed login/authentication or the finished
  frontend** unless testing exposes a defect.
- Reuse the existing UI and connect it to working APIs; do not create
  a second dashboard design.
- Keep certificate files and personal information **off-chain**. Store
  only the required hash/identifier/status proof on-chain.
- A SHA-256 match is meaningful for the exact original digital file. A
  scan or photograph will not normally have the same binary hash, so
  it needs the other verification checks.
- Treat signature/logo/image analysis as indicators, not definitive
  proof. Flag insufficient or conflicting evidence for institutional
  review.
- Keep blockchain and AI integrations behind service modules so they
  can be tested independently.
- Never show a certificate as verified just because a QR code exists.
  Validate its signature/token and cross-check records.
- The report describes a weighted trust score with a maximum of **95
  points**: blockchain match +30, database match +25, valid QR +15,
  OCR field match +15, signature signal +5, logo/template signal +5.
  Confirm and document how the application handles missing signals and
  normalizes the score before production use.
- The report's risk bands are: **85--100 Verified, 65--84 Low Risk,
  40--64 Review Required, 0--39 High Risk**. The documented maximum of
  95 and a 100-point upper band do not align perfectly; decide and
  document whether to normalize to 100 or adjust the bands before
  implementing the final classification.
- Stack in the report: React/React Native frontend, Node.js/Express
  API, PostgreSQL, Python AI service (OCR/OpenCV), S3-compatible
  object storage, Redis queue for longer jobs,
  Solidity/Hardhat/Ethers.js and a Polygon test network for the MVP.
  Adapt service names to the repository's actual structure.

## Definition of done for each day

- [ ] Code is committed or saved in a recoverable state.
- [ ] The task's happy path works.
- [ ] At least one relevant failure/invalid-input case is tested.
- [ ] No secrets, private keys, tokens, or certificate contents are
      logged.
- [ ] Existing functionality still works.

---

# Phase 0 --- Login System (Completed)

# Phase 1 --- Connect the completed frontend to real dashboard data

## Day 1 --- Repository and API audit (1 hour)

- [-] Locate existing frontend routes, role names, dashboard pages,
  API client, backend routes, database schema, and authentication
  middleware.
- [-] Confirm how the logged-in user's ID, role, and institution are
  obtained.
- [-] List dashboard cards/tables currently using mock or hard-coded
  data.
- [-] Create a short endpoint map in the project notes.
- **Deliverable:** A clear list of existing components to connect,
  without duplicating completed work.

## Day 2 --- Role-based dashboard access (1 hour)

- [-] Confirm supported roles from the report: Admin,
  Issuer/Institution, Student/Holder, Verifier, and Auditor/Regulatory
  Body where applicable.
- [-] Add or verify backend authorization middleware for dashboard
  endpoints.
- [-] Ensure each role can access only its own dashboard and permitted
  data.
- [-] Test a request made with the wrong role.
- **Deliverable:** Dashboard API access is role-restricted on the
  backend, not just hidden in the UI.

## Day 3 --- Dashboard summary API (1 hour)

- [-] Define a small summary response for the first dashboard: counts
  of certificates, verifications, and pending reviews as appropriate
  for that role.
- [-] Implement aggregate database queries using the existing schema.
- [-] Scope issuer/holder results to the authenticated user or
  institution.
- [-] Return zero values cleanly when there is no data.
- **Deliverable:** First real dashboard summary endpoint.

## Day 4 --- Connect dashboard cards (1 hour)

- [-] Replace hard-coded summary values in the existing dashboard with
  API data.
- [-] Add loading, empty, and error states.
- [-] Prevent repeated requests caused by unnecessary component
  re-renders.
- [-] Verify that refreshing the page shows current database values.
- **Deliverable:** Dashboard cards display real data.

## Day 5 --- Recent activity and status lists (1 hour)

- [-] Identify the activity events already supported by the data model
  (issuance, verification, revocation, review).
- [-] Implement a paginated or limited recent-activity API.
- [-] Connect the existing recent activity/list component.
- [-] Ensure users cannot see another institution's or user's
  restricted records.
- **Deliverable:** Dashboard has a real, access-controlled recent
  activity feed.

## Day 6 --- Dashboard filters and navigation (1 hour)

- [-] Connect existing status/date filters to API query parameters if
  present in the UI.
- [-] Make dashboard actions navigate to the correct existing pages.
- [-] Validate filter values on the backend.
- [-] Test empty filter results and invalid parameters.
- **Deliverable:** Dashboard actions and filters work end to end.

## Day 7 --- Dashboard smoke test and checkpoint (1 hour)

- [-] Test each available role with a representative account.
- [-] Test no-data, loading, API failure, and unauthorized access.
- [-] Remove any remaining demo values that could be mistaken for real
  records.
- [-] Record any schema/UI mismatch before moving on.
- **Deliverable:** Dashboard foundation is reliable.

---

# Phase 2 --- Certificate data and issuance

## Day 8 --- Certificate schema and lifecycle audit (1 hour)

- [ ] Compare the existing database schema with required fields:
      certificate ID, student/holder, certificate type/number,
      issuer/institution, issue date, status, SHA-256 hash, QR
      token/reference, blockchain transaction, revoked status, and
      creation date.
- [ ] Identify missing fields only; do not recreate existing tables
      unnecessarily.
- [ ] Define allowed states such as Issued, Under Review, Revoked, and
      Expired.
- [ ] Add or document migrations for confirmed gaps.
- **Deliverable:** Database supports the issuance lifecycle.

## Day 9 --- Issuer permission and input validation (1 hour)

- [ ] Restrict certificate creation to authorized issuer/admin roles.
- [ ] Validate required holder and certificate fields on the server.
- [ ] Validate date formats, field lengths, and certificate-number
      uniqueness rules.
- [ ] Return useful validation errors without exposing stack traces.
- **Deliverable:** Secure and predictable certificate-creation input.

## Day 10 --- Create certificate record API (1 hour)

- [ ] Implement the create-certificate endpoint using the existing
      database layer.
- [ ] Generate a unique certificate ID on the server.
- [ ] Save issuer, holder, certificate metadata, and initial status
      transactionally where supported.
- [ ] Test duplicate certificate numbers and missing fields.
- **Deliverable:** Certificate metadata can be created reliably.

## Day 11 --- Connect existing certificate form (1 hour)

- [ ] Connect the finished frontend form to the create-certificate
      endpoint.
- [ ] Show field validation and API errors in the existing UI.
- [ ] Prevent accidental double submission.
- [ ] Show the created certificate ID after success.
- **Deliverable:** Issuer can create a certificate record from the UI.

## Day 12 --- Certificate PDF generation (1 hour)

- [ ] Inspect existing certificate template/design and select the
      server-side PDF generation approach already compatible with the
      project.
- [ ] Map validated certificate data into the template.
- [ ] Generate a PDF for one certificate.
- [ ] Check long names, special characters, page overflow, and missing
      optional fields.
- **Deliverable:** One valid certificate PDF can be generated from
  stored data.

## Day 13 --- File storage integration (1 hour)

- [ ] Configure the chosen S3-compatible storage provider using
      environment variables.
- [ ] Upload the generated PDF and save its storage key/URL in the
      database.
- [ ] Keep credentials and private file URLs out of client code and
      logs.
- [ ] Test upload failure and cleanup of incomplete records/files.
- **Deliverable:** Issued certificate files are stored safely outside
  the database and blockchain.

## Day 14 --- SHA-256 hash generation (1 hour)

- [ ] Hash the exact final PDF bytes using SHA-256 on the backend.
- [ ] Persist the hash against the certificate record.
- [ ] Add a small test that confirms identical bytes produce the same
      hash and modified bytes produce a different hash.
- [ ] Ensure the PDF is finalized before hashing; do not regenerate it
      after storing the hash.
- **Deliverable:** Each issued PDF has a reproducible integrity hash.

## Day 15 --- Signed QR token and verification URL (1 hour)

- [ ] Define a token payload containing only the required certificate
      ID, issuer ID, and integrity-protected claims.
- [ ] Sign the token server-side using a secret/private key stored in
      environment configuration.
- [ ] Generate a QR code containing the verification URL or signed
      token reference.
- [ ] Add token-expiry/key-rotation considerations where relevant;
      never place personal data in a public QR URL.
- **Deliverable:** Certificate has a QR code that points to a
  verifiable record.

## Day 16 --- Complete the issuance transaction (1 hour)

- [ ] Make issuance proceed in a controlled order: validate data →
      create record → generate PDF → store file → hash final PDF → create
      signed QR → save final issuance state.
- [ ] Define what happens if PDF generation, storage, or QR creation
      fails.
- [ ] Avoid marking a certificate fully issued until required steps
      succeed.
- [ ] Test a successful issue and one forced failure.
- **Deliverable:** Issuance works as one consistent workflow.

## Day 17 --- Issuer certificate list and detail view (1 hour)

- [ ] Implement a list endpoint scoped to the issuer's institution.
- [ ] Implement a detail endpoint with status and issuance metadata.
- [ ] Connect existing table/detail UI, search, and pagination if
      already designed.
- [ ] Verify one issuer cannot read another institution's records.
- **Deliverable:** Issuers can view and manage their issued records.

---

# Phase 3 --- Holder experience

## Day 18 --- Holder certificate list API (1 hour)

- [ ] Query certificates associated with the authenticated
      holder/student.
- [ ] Return only fields needed for the holder's list.
- [ ] Include status, issue date, certificate type, and certificate
      ID.
- [ ] Test a holder attempting to access another holder's data.
- **Deliverable:** Secure holder certificate-list endpoint.

## Day 19 --- Connect holder dashboard (1 hour)

- [ ] Connect the existing holder dashboard/list to the new endpoint.
- [ ] Add loading, empty, and error states.
- [ ] Display issued, revoked, expired, or under-review status
      clearly.
- [ ] Confirm a holder sees only their own certificates.
- **Deliverable:** Holder dashboard shows real issued certificates.

## Day 20 --- Certificate detail, download, and sharing (1 hour)

- [ ] Implement an authorized certificate-detail endpoint.
- [ ] Add secure download or short-lived signed file URL.
- [ ] Show QR code and public verification link where appropriate.
- [ ] Test revoked certificates and inaccessible files.
- **Deliverable:** Holder can view, download, and share a certificate
  safely.

---

# Phase 4 --- Blockchain registration

## Day 21 --- Smart contract MVP design (1 hour)

- [ ] Confirm the MVP network and testnet configuration.
- [ ] Define the minimum contract functions for registering a
      certificate hash, reading its record, and recording
      revocation/status.
- [ ] Store only certificate identifiers/hashes and minimal status
      proof on-chain.
- [ ] Define duplicate-registration and unauthorized-issuer behavior.
- **Deliverable:** Contract interface and data rules are documented.

## Day 22 --- Implement and test the contract (1 hour)

- [ ] Implement the Solidity contract using the project's existing
      Hardhat setup.
- [ ] Add tests for authorized registration, duplicate hashes, reads,
      and unauthorized calls.
- [ ] Add tests for revocation/status transitions if supported in the
      chosen design.
- [ ] Run the local test suite.
- **Deliverable:** Contract logic passes basic tests.

## Day 23 --- Deploy to test network (1 hour)

- [ ] Configure RPC URL, deployer key, and network settings through
      environment variables.
- [ ] Ensure private keys are never committed to source control.
- [ ] Deploy to the selected test network and record the contract
      address.
- [ ] Save ABI/address in the backend configuration.
- **Deliverable:** Test contract is deployed and reachable.

## Day 24 --- Backend blockchain service (1 hour)

- [ ] Create a dedicated blockchain service module using Ethers.js.
- [ ] Implement register-hash and read-record functions.
- [ ] Save transaction hash, network, and registration status in
      PostgreSQL.
- [ ] Handle RPC errors and transaction reverts with actionable
      internal logs.
- **Deliverable:** Backend can interact with the contract
  independently of route handlers.

## Day 25 --- Connect issuance to blockchain (1 hour)

- [ ] Call blockchain registration after the PDF hash is finalized.
- [ ] Track pending, confirmed, and failed registration states.
- [ ] Do not report a blockchain match until the record is
      confirmed/readable.
- [ ] Test transaction failure and safe retry without creating
      duplicate records.
- **Deliverable:** Issued certificates receive a blockchain integrity
  record.

## Day 26 --- Blockchain verification service (1 hour)

- [ ] Implement lookup by certificate ID/hash according to the
      contract design.
- [ ] Compare the stored hash and issuer/status data with the database
      record.
- [ ] Return structured results for match, mismatch, not found, and
      network error.
- [ ] Test with a modified hash and a missing on-chain record.
- **Deliverable:** Blockchain verification can be reused by the
  verification pipeline.

---

# Phase 5 --- Verifier intake and verification job

## Day 27 --- Verification request model and API (1 hour)

- [ ] Create or confirm the verification record/job fields: job ID,
      uploaded file reference, requester, status, timestamps, and result
      reference.
- [ ] Implement an endpoint that accepts a certificate upload or QR
      verification request.
- [ ] Validate file type, file size, and
      authentication/anonymous-access policy.
- [ ] Store the request as queued/pending before running expensive
      analysis.
- **Deliverable:** Verification requests are recorded safely.

## Day 28 --- Secure upload and preprocessing (1 hour)

- [ ] Accept PDF, scan, or photograph formats within configured
      limits.
- [ ] Validate actual file content as well as extension/MIME type.
- [ ] Store uploads in private object storage and generate a safe
      internal reference.
- [ ] Add preprocessing for PDF pages/images and handle corrupt or
      unsupported files.
- **Deliverable:** Verifier uploads are stored and prepared safely.

## Day 29 --- QR verification endpoint (1 hour)

- [ ] Decode a QR code from an uploaded image or accept a QR
      verification reference.
- [ ] Validate the signed token and extract its certificate/issuer
      reference.
- [ ] Check that the certificate exists and is not revoked/expired.
- [ ] Return a structured result without exposing private holder data.
- **Deliverable:** QR-only verification works before AI analysis is
  added.

## Day 30 --- Verification status and progress API (1 hour)

- [ ] Define job states such as queued, preprocessing, OCR, QR
      analysis, AI analysis, blockchain check, completed, and failed.
- [ ] Implement an endpoint to read job progress and final result.
- [ ] Restrict access to the requester and permitted institution/admin
      roles.
- [ ] Test unknown job IDs and unauthorized status access.
- **Deliverable:** Frontend can display verification progress.

## Day 31 --- Queue/worker integration (1 hour)

- [ ] Add or configure Redis and the job queue if they are part of the
      selected deployment.
- [ ] Enqueue long-running verification work instead of blocking the
      request.
- [ ] Add retry limits, failure state, and duplicate-job protection.
- [ ] If Redis is not yet available, isolate the job interface so a
      temporary development worker can be replaced later.
- **Deliverable:** Long-running verification can run asynchronously.

---

# Phase 6 --- OCR and document analysis

## Day 32 --- Python AI service skeleton (1 hour)

- [ ] Create the Python service boundary described in the report,
      using the project's chosen API framework.
- [ ] Add a health endpoint and a request/response schema for document
      analysis.
- [ ] Configure internal authentication between Node.js and the Python
      service.
- [ ] Add basic timeouts and clear error responses.
- **Deliverable:** Node.js can call a separately testable AI service.

## Day 33 --- OCR extraction baseline (1 hour)

- [ ] Integrate the selected OCR engine (EasyOCR or Tesseract) for one
      PDF/image.
- [ ] Extract raw text and preserve a basic confidence/diagnostic
      result if available.
- [ ] Handle low-resolution, rotated, blank, and unreadable documents.
- [ ] Save OCR output only where needed and protect sensitive content.
- **Deliverable:** OCR returns text for a supported sample
  certificate.

## Day 34 --- Normalize and match certificate fields (1 hour)

- [ ] Extract/normalize candidate name, certificate number,
      degree/type, grade, and issue date.
- [ ] Compare fields against the institution's certificate record.
- [ ] Handle whitespace, case, date-format differences, and OCR
      uncertainty.
- [ ] Return field-level match/mismatch/unknown values rather than a
      single unexplained boolean.
- **Deliverable:** OCR fields can be compared with institutional
  records.

## Day 35 --- Image preprocessing and forensic baseline (1 hour)

- [ ] Add image preprocessing such as rotation correction, resizing,
      denoising, and contrast adjustment.
- [ ] Record metadata/compression signals where feasible.
- [ ] Add an initial ELA or other explainable forensic indicator if
      appropriate for the image format.
- [ ] Label unsupported signals as unavailable; do not automatically
      call them fraud.
- **Deliverable:** Basic document-forensics signals are returned.

## Day 36 --- Signature, logo, and template signals (1 hour)

- [ ] Define expected institution logo/template references and
      signature-region handling.
- [ ] Implement a baseline comparison or placeholder service contract
      for these signals.
- [ ] Return confidence and availability for each signal.
- [ ] Document that these are indicators and cannot guarantee
      signature authenticity.
- **Deliverable:** Verification pipeline has a stable interface for
  signature/logo checks.

---

# Phase 7 --- Combine checks, score, and report

## Day 37 --- Verification orchestrator (1 hour)

- [ ] Combine database lookup, QR validation, OCR comparison,
      blockchain lookup, and available forensic signals.
- [ ] Make each check return pass, fail, unknown, or error with a
      reason.
- [ ] Ensure one failed external service does not silently become a
      successful check.
- [ ] Store per-check results against the verification job.
- **Deliverable:** One orchestrator returns all available evidence.

## Day 38 --- Trust score and risk classification (1 hour)

- [ ] Implement the documented weights: blockchain +30, database +25,
      QR +15, OCR +15, signature +5, logo/template +5.
- [ ] Decide how unknown/unavailable checks affect the score and
      document the rule.
- [ ] Resolve the report's 95-point maximum versus 100-point category
      range before finalizing the calculation.
- [ ] Map the finalized score to Verified, Low Risk, Review Required,
      or High Risk.
- [ ] Add unit tests for boundary values and missing signals.
- **Deliverable:** Deterministic, testable scoring logic with
  documented limitations.

## Day 39 --- Persist results and show verifier outcome (1 hour)

- [ ] Save the final score, risk category, per-check details, and
      completion time.
- [ ] Connect the existing verifier UI to the job-status and result
      endpoints.
- [ ] Show progress, failed checks, unknown checks, and the reason for
      the final category.
- [ ] Ensure a QR/database match alone cannot bypass other checks or
      revocation status.
- **Deliverable:** Verifier sees a transparent result rather than only
  a yes/no answer.

## Day 40 --- Downloadable verification report (1 hour)

- [ ] Generate a report PDF containing the certificate reference,
      request date, risk category, score, checks performed, outcomes, and
      limitations.
- [ ] Avoid exposing internal secrets or unnecessary personal data.
- [ ] Store the report and expose an authorized download endpoint.
- [ ] Test a completed report and a report with unavailable signals.
- **Deliverable:** Verifier can download a detailed verification
  report.

---

# Phase 8 --- Review, revocation, bulk issuance, and administration

## Day 41 --- Manual review case workflow (1 hour)

- [ ] Create a fraud/review case when a result requires institutional
      review.
- [ ] Store the reason, evidence references, status, assignee, and
      timestamps.
- [ ] Restrict case access to authorized institution/admin roles.
- [ ] Test opening and resolving a case.
- **Deliverable:** Uncertain results can be reviewed by a human.

## Day 42 --- Issuer review queue (1 hour)

- [ ] Add an API for an institution's pending review cases.
- [ ] Connect the existing review UI if available.
- [ ] Allow authorized reviewers to record a decision and notes.
- [ ] Keep an audit trail of decisions and prevent unauthorized
      changes.
- **Deliverable:** Institution can process flagged certificates.

## Day 43 --- Certificate revocation (1 hour)

- [ ] Implement an authorized revocation endpoint with a required
      reason.
- [ ] Update the database status and record actor/time/reason.
- [ ] Update the blockchain status if the contract design supports it;
      handle chain failure explicitly.
- [ ] Ensure QR and uploaded-file verification detect revoked
      certificates.
- **Deliverable:** Revocation affects future verification results.

## Day 44 --- Bulk certificate issuance (1 hour)

- [ ] Define an accepted CSV/XLSX column template and validate it.
- [ ] Preview row-level errors before issuing anything.
- [ ] Process valid rows with unique IDs and clear per-row status.
- [ ] Avoid partial/duplicate issuance on retries; test a small batch
      first.
- **Deliverable:** Issuer can import a small batch safely.

## Day 45 --- Admin user/institution management (1 hour)

- [ ] Audit existing admin APIs and database fields.
- [ ] Implement missing institution/user list, detail, and status
      operations required by the current UI.
- [ ] Enforce admin-only permissions and validate all updates.
- [ ] Test unauthorized access and invalid role changes.
- **Deliverable:** Admin can manage users/institutions within the
  defined scope.

## Day 46 --- Admin analytics and audit trail (1 hour)

- [ ] Add aggregate counts for issued, verified, revoked,
      pending-review, and high-risk records.
- [ ] Record security-sensitive actions such as issuance, revocation,
      role changes, and review decisions.
- [ ] Restrict audit logs and avoid logging secrets or full
      certificate content.
- [ ] Connect dashboard analytics to real data.
- **Deliverable:** Admin has meaningful operational analytics and
  traceable actions.

---

# Phase 9 --- Security, testing, and delivery

## Day 47 --- Authorization and data isolation review (1 hour)

- [ ] Test issuer, holder, verifier, auditor, and admin access
      boundaries.
- [ ] Check direct-object-reference attacks by changing
      certificate/job IDs.
- [ ] Verify all sensitive endpoints authorize on the server.
- [ ] Fix the highest-impact access-control issue found.
- **Deliverable:** Role and record isolation has been tested.

## Day 48 --- Upload and API hardening (1 hour)

- [ ] Enforce upload size/type limits and safe filenames.
- [ ] Add rate limits to upload and verification endpoints.
- [ ] Validate query/body parameters and use safe database queries.
- [ ] Confirm CORS, security headers, and production error handling.
- **Deliverable:** Common API and upload risks are reduced.

## Day 49 --- Integration test: issuance to holder (1 hour)

- [ ] Create a test issuer and holder.
- [ ] Issue a certificate from the existing UI.
- [ ] Confirm PDF, hash, QR, database record, and blockchain state
      where configured.
- [ ] Sign in as the holder and verify listing, detail, download, and
      sharing.
- **Deliverable:** The issuer-to-holder journey works end to end.

## Day 50 --- Integration test: verifier journey (1 hour)

- [ ] Verify the original issued PDF.
- [ ] Verify a scan/photo of the same certificate.
- [ ] Test invalid QR, unknown certificate, modified PDF, and revoked
      certificate.
- [ ] Confirm every result includes a reason and does not overstate
      certainty.
- **Deliverable:** Main verification paths and key negative cases
  work.

## Day 51 --- Accuracy and performance baseline (1 hour)

- [ ] Prepare a small, permissioned test set of genuine, modified,
      low-quality, and unsupported samples.
- [ ] Record OCR field-match outcomes and false positives/negatives.
- [ ] Measure basic request time and queue processing time.
- [ ] Document limits; do not claim accuracy from a tiny sample.
- **Deliverable:** Initial evidence for quality and performance
  decisions.

## Day 52 --- Deployment configuration and recovery (1 hour)

- [ ] Verify production environment variables for database, object
      storage, queue, AI service, and blockchain RPC/contract.
- [ ] Confirm secrets are not committed and test environment is
      separated from production.
- [ ] Test database migration and backup/restore procedure where
      available.
- [ ] Check health endpoints and logs for failed background jobs.
- **Deliverable:** Deployment configuration is documented and
  recoverable.

## Day 53 --- Final regression and handover (1 hour)

- [ ] Retest login (already completed), role routing, dashboards,
      issuance, holder access, QR, verification, reports, and revocation.
- [ ] Fix or record remaining blockers.
- [ ] Update README with setup steps, environment-variable names,
      migrations, test commands, and known limitations.
- [ ] Prepare a short demo sequence: issuer issues → holder shares →
      verifier checks → report generated → issuer/admin revokes → verifier
      sees revoked status.
- **Deliverable:** A reproducible demo and handover checklist.

---

# Optional extensions (only after the MVP is stable)

- [ ] Add notification emails for issuance, verification completion,
      review assignment, and revocation.
- [ ] Add Merkle-tree batching for periodic public anchoring if
      transaction costs or scale require it.
- [ ] Explore Hyperledger Fabric institutional consortium integration
      as a later phase; it is not required for the first MVP if Polygon
      testnet is the selected approach.
- [ ] Add advanced CNN/ResNet/ViT-based image forgery detection only
      after establishing a labelled evaluation dataset and a baseline.
- [ ] Add a dedicated auditor view for logs, fraud cases, and
      institution-level analytics if required by the initial release
      scope.
- [ ] Add mobile-specific integration only after the web workflow and
      APIs are stable.

# Completion summary

- [-] Phase 1 --- Dashboard data and role access
- [ ] Phase 2 --- Certificate issuance
- [ ] Phase 3 --- Holder experience
- [ ] Phase 4 --- Blockchain registration
- [ ] Phase 5 --- Verifier intake and job processing
- [ ] Phase 6 --- OCR and document analysis
- [ ] Phase 7 --- Scoring and report generation
- [ ] Phase 8 --- Review, revocation, bulk issuance, and
      administration
- [ ] Phase 9 --- Security, testing, and delivery
