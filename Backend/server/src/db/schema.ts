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
  varchar,
} from "drizzle-orm/pg-core";

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
  certificateNumber: varchar("certificate_number", { length: 100 }).unique(),
  issuerId: integer("issuer_id").references(() => users.id),
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
