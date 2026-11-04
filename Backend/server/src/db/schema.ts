import {
  boolean,
  date,
  integer,
  index,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", [
  "admin",
  "issuer",
  "holder",
  "verifier",
]);

export const certificateStatus = pgEnum("certificate_status", [
  "pending_registration",
  "issued",
  "registration_failed",
  "revocation_pending",
  "revoked",
  "expired",
]);

export const blockchainRegistrationStatus = pgEnum(
  "blockchain_registration_status",
  ["not_submitted", "submitted", "confirmed", "failed"],
);

export const blockchainRevocationStatus = pgEnum(
  "blockchain_revocation_status",
  ["not_submitted", "submitted", "confirmed", "failed"],
);

export const credentialClaimStatus = pgEnum("credential_claim_status", [
  "requested",
  "approved",
  "claimed",
  "rejected",
]);

export const credentialVisibility = pgEnum("credential_visibility", [
  "public",
  "unlisted",
  "private",
]);

export const pdfDownloadPolicy = pgEnum("pdf_download_policy", [
  "private",
  "link",
  "public",
]);

export const bulkImportStatus = pgEnum("bulk_import_status", [
  "queued",
  "processing",
  "completed",
  "completed_with_errors",
  "failed",
]);

export const bulkDocumentStatus = pgEnum("bulk_document_status", [
  "queued",
  "validated",
  "issuing",
  "issued",
  "failed",
  "manual_review",
]);

export const invitationDeliveryStatus = pgEnum("invitation_delivery_status", [
  "queued",
  "sending",
  "sent",
  "retry",
  "failed",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: userRole("role").notNull(),
  institutionName: varchar("institution_name", { length: 255 }),
  avatarData: text("avatar_data"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certificateId: varchar("certificate_id", { length: 100 }).notNull().unique(),
  bulkImportDocumentId: integer("bulk_import_document_id"),
  certificateNumber: varchar("certificate_number", { length: 100 }).unique(),
  issuerId: integer("issuer_id").references(() => users.id),
  recipientId: integer("recipient_id").references(() => recipientRecords.id),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  course: varchar("course", { length: 255 }).notNull(),
  certificateType: varchar("certificate_type", { length: 40 })
    .notNull()
    .default("custom"),
  title: varchar("title", { length: 255 }).notNull().default("Certificate"),
  grade: varchar("grade", { length: 50 }),
  issueDate: date("issue_date"),
  expiryDate: date("expiry_date"),
  status: certificateStatus("status")
    .notNull()
    .default("registration_failed"),
  storageKey: text("storage_key"),
  fileMimeType: varchar("file_mime_type", { length: 100 }),
  fileSize: integer("file_size"),
  certificateHash: text("certificate_hash").notNull(),
  qrTokenVersion: integer("qr_token_version").notNull().default(1),
  verificationUrl: text("verification_url"),
  blockchainNetwork: varchar("blockchain_network", { length: 100 }),
  contractAddress: varchar("contract_address", { length: 255 }),
  blockchainTxHash: text("blockchain_tx_hash"),
  blockchainBlockNumber: text("blockchain_block_number"),
  registrationStatus: blockchainRegistrationStatus("registration_status")
    .notNull()
    .default("failed"),
  revocationStatus: blockchainRevocationStatus("revocation_status")
    .notNull()
    .default("not_submitted"),
  revocationReason: text("revocation_reason"),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  issuedAt: timestamp("issued_at").defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("certificates_issuer_id_idx").on(table.issuerId),
  index("certificates_issuer_status_idx").on(table.issuerId, table.status),
  uniqueIndex("certificates_bulk_import_document_unique").on(table.bulkImportDocumentId),
]);

export const recipientRecords = pgTable("recipient_records", {
  id: serial("id").primaryKey(),
  issuerId: integer("issuer_id")
    .notNull()
    .references(() => users.id),
  recipientName: varchar("recipient_name", { length: 255 }).notNull(),
  institutionReference: varchar("institution_reference", { length: 255 }),
  email: varchar("email", { length: 320 }),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  academicDetails: jsonb("academic_details").$type<Record<string, string | number | null>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("recipient_records_issuer_idx").on(table.issuerId),
  uniqueIndex("recipient_records_issuer_reference_unique")
    .on(table.issuerId, table.institutionReference)
    .where(sql`institution_reference IS NOT NULL`),
]);

export const credentialClaims = pgTable("credential_claims", {
  id: serial("id").primaryKey(),
  certificateRowId: integer("certificate_row_id")
    .notNull()
    .references(() => certificates.id),
  recipientId: integer("recipient_id").references(() => recipientRecords.id),
  holderId: integer("holder_id").references(() => users.id),
  status: credentialClaimStatus("status").notNull().default("requested"),
  claimMethod: varchar("claim_method", { length: 40 }).notNull(),
  evidenceCategory: varchar("evidence_category", { length: 100 }),
  decisionReason: text("decision_reason"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  uniqueIndex("credential_claims_certificate_unique").on(table.certificateRowId),
  index("credential_claims_holder_idx").on(table.holderId, table.status),
]);

export const credentialClaimTokens = pgTable("credential_claim_tokens", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id")
    .notNull()
    .references(() => credentialClaims.id),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  recipientEmail: varchar("recipient_email", { length: 320 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("credential_claim_tokens_claim_idx").on(table.claimId),
  index("credential_claim_tokens_expiry_idx").on(table.expiresAt),
]);

export const invitationOutbox = pgTable("invitation_outbox", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id")
    .notNull()
    .references(() => credentialClaims.id),
  recipientEmail: varchar("recipient_email", { length: 320 }).notNull(),
  status: invitationDeliveryStatus("status").notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("invitation_outbox_status_attempt_idx").on(
    table.status,
    table.nextAttemptAt,
  ),
]);

export const credentialSharingSettings = pgTable("credential_sharing_settings", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id")
    .notNull()
    .references(() => credentialClaims.id),
  visibility: credentialVisibility("visibility").notNull().default("unlisted"),
  pdfDownloadPolicy: pdfDownloadPolicy("pdf_download_policy")
    .notNull()
    .default("private"),
  showRecipientName: boolean("show_recipient_name").notNull().default(false),
  allowStructuredExport: boolean("allow_structured_export").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  uniqueIndex("credential_sharing_settings_claim_unique").on(table.claimId),
]);

export const credentialShareLinks = pgTable("credential_share_links", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id")
    .notNull()
    .references(() => credentialClaims.id),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  allowPdfDownload: boolean("allow_pdf_download").notNull().default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("credential_share_links_claim_idx").on(table.claimId),
]);

export const bulkImportJobs = pgTable("bulk_import_jobs", {
  id: serial("id").primaryKey(),
  issuerId: integer("issuer_id")
    .notNull()
    .references(() => users.id),
  idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull(),
  status: bulkImportStatus("status").notNull().default("queued"),
  totalDocuments: integer("total_documents").notNull().default(0),
  completedDocuments: integer("completed_documents").notNull().default(0),
  failedDocuments: integer("failed_documents").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  uniqueIndex("bulk_import_jobs_issuer_idempotency_unique").on(
    table.issuerId,
    table.idempotencyKey,
  ),
  index("bulk_import_jobs_issuer_status_idx").on(table.issuerId, table.status),
]);

export const bulkImportDocuments = pgTable("bulk_import_documents", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => bulkImportJobs.id),
  rowNumber: integer("row_number").notNull(),
  status: bulkDocumentStatus("status").notNull().default("queued"),
  input: jsonb("input").$type<Record<string, string | null>>().notNull(),
  certificateRowId: integer("certificate_row_id").references(() => certificates.id),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  uniqueIndex("bulk_import_documents_job_row_unique").on(table.jobId, table.rowNumber),
  index("bulk_import_documents_job_status_idx").on(table.jobId, table.status),
]);

export const holderAuthenticators = pgTable("holder_authenticators", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  transports: jsonb("transports").$type<string[]>().notNull().default([]),
  deviceName: varchar("device_name", { length: 100 }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("holder_authenticators_user_idx").on(table.userId, table.revokedAt),
]);

export const holderAuthenticatorChallenges = pgTable("holder_authenticator_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  challengeHash: varchar("challenge_hash", { length: 64 }).notNull().unique(),
  purpose: varchar("purpose", { length: 30 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("holder_authenticator_challenges_user_idx").on(table.userId, table.expiresAt),
]);

export const structuredCredentials = pgTable("structured_credentials", {
  id: serial("id").primaryKey(),
  certificateRowId: integer("certificate_row_id")
    .notNull()
    .references(() => certificates.id),
  credentialJson: jsonb("credential_json").$type<Record<string, unknown>>().notNull(),
  credentialDigest: varchar("credential_digest", { length: 64 }).notNull(),
  proofKeyId: varchar("proof_key_id", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  uniqueIndex("structured_credentials_certificate_unique").on(table.certificateRowId),
]);

export const certificateAuditLogs = pgTable("certificate_audit_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id),
  certificateRowId: integer("certificate_row_id").references(
    () => certificates.id,
  ),
  action: varchar("action", { length: 100 }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, string | number | null>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("certificate_audit_logs_certificate_created_idx").on(
    table.certificateRowId,
    table.createdAt,
  ),
]);
