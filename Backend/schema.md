# CertifyVault Database Schema

**Document Version:** 1.0  
**Date:** September 26, 2026  
**Database:** PostgreSQL 15+  
**ORM:** Drizzle ORM  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Table Definitions](#3-table-definitions)
4. [Indexes](#4-indexes)
5. [Constraints](#5-constraints)
6. [Relationships](#6-relationships)
7. [Migration Strategy](#7-migration-strategy)
8. [Data Retention Policy](#8-data-retention-policy)

---

## 1. Overview

### 1.1 Database Design Principles

- **Normalization:** 3NF where practical, denormalize for performance where needed
- **Consistency:** Foreign keys enforced for data integrity
- **Scalability:** Indexed columns for common queries
- **Audit Trail:** Track creation and modification timestamps
- **Soft Deletes:** Optional (future consideration)

### 1.2 Entity Summary

| Entity | Purpose | Records (Est.) | Growth Rate |
|--------|---------|----------------|-------------|
| `users` | User accounts | 10K | Medium |
| `institutions` | Educational organizations | 100 | Low |
| `students` | Certificate recipients | 100K | High |
| `certificates` | Issued certificates | 500K | Very High |
| `templates` | Certificate templates | 50 | Low |
| `verifications` | Verification records | 1M | Very High |
| `revocations` | Revoked certificates | 1K | Low |
| `fraud_alerts` | Fraud detection alerts | 5K | Medium |
| `audit_logs` | System audit trail | 10M | Very High |
| `sessions` | Active user sessions | 5K | Medium |

---

## 2. Entity Relationship Diagram

```
┌──────────────┐         ┌────────────────┐
│ institutions │◄────────│     users      │
└──────┬───────┘         └────────────────┘
       │                          │
       │ 1:N                      │ 1:N (issued_by)
       │                          │
       ▼                          ▼
┌──────────────┐         ┌────────────────┐
│   students   │         │ certificates   │
└──────┬───────┘         └────────┬───────┘
       │                          │
       │ 1:N                      │ 1:N
       │                          │
       │                          ▼
       │                 ┌────────────────┐
       │                 │ verifications  │
       │                 └────────────────┘
       │
       │                 ┌────────────────┐
       └─────────────────┤  revocations   │
                         └────────────────┘

┌──────────────┐         ┌────────────────┐
│  templates   │◄────────│ certificates   │
└──────────────┘         └────────┬───────┘
                                  │
                                  │ 1:N
                                  ▼
                         ┌────────────────┐
                         │ fraud_alerts   │
                         └────────────────┘

┌──────────────┐
│ audit_logs   │
└──────────────┘

┌──────────────┐
│   sessions   │
└──────────────┘
```

---

## 3. Table Definitions

### 3.1 users

Stores all user accounts (Admin, Issuer, Holder, Verifier).

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `email` | VARCHAR(255) | NO | | UNIQUE | User email (login) |
| `password_hash` | VARCHAR(255) | NO | | | Bcrypt hashed password |
| `name` | VARCHAR(255) | NO | | | Full name |
| `role` | ENUM | NO | | | `admin`, `issuer`, `holder`, `verifier` |
| `institution_id` | UUID | YES | NULL | FK → institutions.id | Institution (for issuers) |
| `status` | ENUM | NO | `'active'` | | `active`, `inactive`, `invited`, `suspended` |
| `email_verified` | BOOLEAN | NO | `false` | | Email verification status |
| `last_login` | TIMESTAMPTZ | YES | NULL | | Last login timestamp |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `email`
- INDEX: `institution_id`
- INDEX: `role`
- INDEX: `status`

**Drizzle Schema:**
```typescript
export const userRoleEnum = pgEnum('user_role', ['admin', 'issuer', 'holder', 'verifier']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'invited', 'suspended']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull(),
  institutionId: uuid('institution_id').references(() => institutions.id),
  status: userStatusEnum('status').notNull().default('active'),
  emailVerified: boolean('email_verified').notNull().default(false),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.2 institutions

Stores educational institutions and organizations.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `name` | VARCHAR(255) | NO | | | Institution name |
| `type` | ENUM | NO | | | `university`, `college`, `training_institute`, `school`, `other` |
| `address` | TEXT | YES | NULL | | Physical address |
| `website` | VARCHAR(255) | YES | NULL | | Website URL |
| `email` | VARCHAR(255) | NO | | | Contact email |
| `phone` | VARCHAR(50) | YES | NULL | | Contact phone |
| `logo_path` | VARCHAR(500) | YES | NULL | | Logo file path |
| `status` | ENUM | NO | `'active'` | | `active`, `inactive`, `suspended` |
| `verified` | BOOLEAN | NO | `false` | | Admin verification status |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `name`
- INDEX: `status`

**Drizzle Schema:**
```typescript
export const institutionTypeEnum = pgEnum('institution_type', [
  'university',
  'college',
  'training_institute',
  'school',
  'other',
]);
export const institutionStatusEnum = pgEnum('institution_status', ['active', 'inactive', 'suspended']);

export const institutions = pgTable('institutions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: institutionTypeEnum('type').notNull(),
  address: text('address'),
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  logoPath: varchar('logo_path', { length: 500 }),
  status: institutionStatusEnum('status').notNull().default('active'),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.3 students

Stores certificate recipients (students, employees, trainees).

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `institution_id` | UUID | NO | | FK → institutions.id | Institution |
| `name` | VARCHAR(255) | NO | | | Student full name |
| `email` | VARCHAR(255) | NO | | | Student email |
| `roll_no` | VARCHAR(100) | YES | NULL | | Roll number / ID |
| `program` | VARCHAR(255) | YES | NULL | | Program / Course |
| `branch` | VARCHAR(255) | YES | NULL | | Branch / Specialization |
| `batch` | VARCHAR(50) | YES | NULL | | Batch year |
| `status` | ENUM | NO | `'active'` | | `active`, `inactive`, `graduated` |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `institution_id`
- INDEX: `email`
- UNIQUE: `(institution_id, email)` - Student email unique per institution
- INDEX: `roll_no`

**Drizzle Schema:**
```typescript
export const studentStatusEnum = pgEnum('student_status', ['active', 'inactive', 'graduated']);

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  rollNo: varchar('roll_no', { length: 100 }),
  program: varchar('program', { length: 255 }),
  branch: varchar('branch', { length: 255 }),
  batch: varchar('batch', { length: 50 }),
  status: studentStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniqueEmailPerInstitution: uniqueIndex('students_institution_email_unique').on(
    table.institutionId,
    table.email
  ),
}));
```

---

### 3.4 templates

Stores certificate templates (background, layout, fields).

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `institution_id` | UUID | NO | | FK → institutions.id | Institution |
| `name` | VARCHAR(255) | NO | | | Template name |
| `type` | VARCHAR(100) | NO | | | Template type identifier |
| `background_image_path` | VARCHAR(500) | YES | NULL | | Background image path |
| `elements` | JSONB | NO | `'[]'` | | Layout elements (logo, QR, signature positions) |
| `fields` | JSONB | NO | `'[]'` | | Dynamic fields configuration |
| `configured` | BOOLEAN | NO | `false` | | Setup completion status |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `institution_id`
- INDEX: `type`

**JSONB Structure:**

**elements:**
```json
[
  {
    "id": "logo",
    "type": "logo",
    "label": "Institution Logo",
    "x": 42,
    "y": 6,
    "width": 16,
    "height": 12
  },
  {
    "id": "qr",
    "type": "qr",
    "label": "QR Code",
    "x": 80,
    "y": 76,
    "width": 14,
    "height": 14
  }
]
```

**fields:**
```json
[
  {
    "id": "studentName",
    "name": "Student Name",
    "enabled": true
  },
  {
    "id": "program",
    "name": "Program / Course",
    "enabled": true
  }
]
```

**Drizzle Schema:**
```typescript
export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  backgroundImagePath: varchar('background_image_path', { length: 500 }),
  elements: jsonb('elements').notNull().default('[]'),
  fields: jsonb('fields').notNull().default('[]'),
  configured: boolean('configured').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.5 certificates

**Core table** - Stores issued certificates.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `certificate_number` | VARCHAR(100) | NO | | UNIQUE | CERT-2026-001245 |
| `institution_id` | UUID | NO | | FK → institutions.id | Issuing institution |
| `student_id` | UUID | NO | | FK → students.id | Recipient student |
| `template_id` | UUID | YES | NULL | FK → templates.id | Template used |
| `certificate_type` | ENUM | NO | | | Certificate type |
| `title` | VARCHAR(255) | NO | | | Certificate title |
| `program` | VARCHAR(255) | NO | | | Program / Course |
| `grade` | VARCHAR(50) | YES | NULL | | Grade / CGPA |
| `issue_date` | DATE | NO | | | Issue date |
| `expiry_date` | DATE | YES | NULL | | Expiry date |
| `status` | ENUM | NO | `'issued'` | | Certificate status |
| `pdf_path` | VARCHAR(500) | NO | | | PDF file path |
| `sha256_hash` | VARCHAR(64) | NO | | UNIQUE | SHA-256 hash |
| `qr_token` | UUID | NO | `gen_random_uuid()` | UNIQUE | QR verification token |
| `qr_image_path` | VARCHAR(500) | YES | NULL | | QR code image path |
| `blockchain_tx_hash` | VARCHAR(255) | YES | NULL | | Blockchain transaction hash |
| `blockchain_network` | VARCHAR(50) | YES | NULL | | Blockchain network |
| `blockchain_status` | ENUM | YES | NULL | | Blockchain status |
| `verification_count` | INTEGER | NO | `0` | | Number of verifications |
| `risk_score` | INTEGER | YES | NULL | | Fraud risk score (0-100) |
| `issued_by` | UUID | NO | | FK → users.id | Issuing user |
| `notes` | TEXT | YES | NULL | | Additional notes |
| `metadata` | JSONB | YES | NULL | | Additional metadata |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | | Last update timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `certificate_number`
- UNIQUE: `sha256_hash`
- UNIQUE: `qr_token`
- INDEX: `institution_id`
- INDEX: `student_id`
- INDEX: `status`
- INDEX: `issue_date`
- INDEX: `certificate_type`

**Drizzle Schema:**
```typescript
export const certificateTypeEnum = pgEnum('certificate_type', [
  'degree',
  'diploma',
  'bonafide',
  'course',
  'internship',
  'training',
  'achievement',
  'custom',
]);

export const certificateStatusEnum = pgEnum('certificate_status', [
  'draft',
  'pending',
  'issued',
  'verified',
  'revoked',
  'expired',
  'suspicious',
]);

export const blockchainStatusEnum = pgEnum('blockchain_status', [
  'confirmed',
  'pending',
  'failed',
]);

export const certificates = pgTable('certificates', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateNumber: varchar('certificate_number', { length: 100 }).notNull().unique(),
  institutionId: uuid('institution_id').notNull().references(() => institutions.id),
  studentId: uuid('student_id').notNull().references(() => students.id),
  templateId: uuid('template_id').references(() => templates.id),
  certificateType: certificateTypeEnum('certificate_type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  program: varchar('program', { length: 255 }).notNull(),
  grade: varchar('grade', { length: 50 }),
  issueDate: date('issue_date').notNull(),
  expiryDate: date('expiry_date'),
  status: certificateStatusEnum('status').notNull().default('issued'),
  pdfPath: varchar('pdf_path', { length: 500 }).notNull(),
  sha256Hash: varchar('sha256_hash', { length: 64 }).notNull().unique(),
  qrToken: uuid('qr_token').notNull().defaultRandom().unique(),
  qrImagePath: varchar('qr_image_path', { length: 500 }),
  blockchainTxHash: varchar('blockchain_tx_hash', { length: 255 }),
  blockchainNetwork: varchar('blockchain_network', { length: 50 }),
  blockchainStatus: blockchainStatusEnum('blockchain_status'),
  verificationCount: integer('verification_count').notNull().default(0),
  riskScore: integer('risk_score'),
  issuedBy: uuid('issued_by').notNull().references(() => users.id),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.6 verifications

Stores verification attempts and results.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `certificate_id` | UUID | NO | | FK → certificates.id | Certificate verified |
| `verifier_id` | UUID | YES | NULL | FK → users.id | Verifier user (if logged in) |
| `verifier_organization` | VARCHAR(255) | YES | NULL | | Organization name (if provided) |
| `method` | ENUM | NO | | | Verification method |
| `result` | ENUM | NO | | | Verification result |
| `trust_score` | INTEGER | NO | | | Trust score (0-100) |
| `checks` | JSONB | NO | `'{}'` | | Verification checks performed |
| `fraud_signals` | JSONB | YES | NULL | | Detected fraud signals |
| `ip_address` | VARCHAR(45) | NO | | | IP address |
| `user_agent` | TEXT | YES | NULL | | User agent string |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Verification timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `certificate_id`
- INDEX: `verifier_id`
- INDEX: `result`
- INDEX: `created_at`

**JSONB Structure:**

**checks:**
```json
{
  "certificate_found": { "status": "pass", "detail": "Certificate exists in database" },
  "issuer_verified": { "status": "pass", "detail": "Institution verified" },
  "qr_valid": { "status": "pass", "detail": "QR token matches" },
  "document_integrity": { "status": "pass", "detail": "SHA-256 hash verified" },
  "revocation_check": { "status": "pass", "detail": "Certificate not revoked" },
  "blockchain_proof": { "status": "pass", "detail": "On-chain proof confirmed" }
}
```

**fraud_signals:**
```json
[
  {
    "type": "hash_mismatch",
    "severity": "high",
    "description": "Document hash does not match stored record"
  }
]
```

**Drizzle Schema:**
```typescript
export const verificationMethodEnum = pgEnum('verification_method', ['qr', 'id', 'upload']);
export const verificationResultEnum = pgEnum('verification_result', ['verified', 'review', 'failed']);

export const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id').notNull().references(() => certificates.id),
  verifierId: uuid('verifier_id').references(() => users.id),
  verifierOrganization: varchar('verifier_organization', { length: 255 }),
  method: verificationMethodEnum('method').notNull(),
  result: verificationResultEnum('result').notNull(),
  trustScore: integer('trust_score').notNull(),
  checks: jsonb('checks').notNull().default('{}'),
  fraudSignals: jsonb('fraud_signals'),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.7 revocations

Stores certificate revocation records.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `certificate_id` | UUID | NO | | FK → certificates.id UNIQUE | Certificate revoked |
| `revoked_by` | UUID | NO | | FK → users.id | User who revoked |
| `reason` | VARCHAR(255) | NO | | | Revocation reason |
| `notes` | TEXT | YES | NULL | | Additional notes |
| `revoked_at` | TIMESTAMPTZ | NO | `NOW()` | | Revocation timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `certificate_id` (one revocation per certificate)
- INDEX: `revoked_by`
- INDEX: `revoked_at`

**Drizzle Schema:**
```typescript
export const revocations = pgTable('revocations', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id').notNull().unique().references(() => certificates.id),
  revokedBy: uuid('revoked_by').notNull().references(() => users.id),
  reason: varchar('reason', { length: 255 }).notNull(),
  notes: text('notes'),
  revokedAt: timestamp('revoked_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.8 fraud_alerts

Stores fraud detection alerts.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `certificate_id` | UUID | NO | | FK → certificates.id | Certificate flagged |
| `verification_id` | UUID | YES | NULL | FK → verifications.id | Related verification |
| `risk_score` | INTEGER | NO | | | Risk score (0-100) |
| `status` | ENUM | NO | `'investigation'` | | Alert status |
| `flags` | JSONB | NO | `'[]'` | | Fraud flags |
| `resolved_at` | TIMESTAMPTZ | YES | NULL | | Resolution timestamp |
| `resolved_by` | UUID | YES | NULL | FK → users.id | User who resolved |
| `resolution_notes` | TEXT | YES | NULL | | Resolution notes |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Alert creation timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `certificate_id`
- INDEX: `status`
- INDEX: `risk_score`
- INDEX: `created_at`

**JSONB Structure:**

**flags:**
```json
[
  {
    "type": "hash_mismatch",
    "level": "critical",
    "description": "Document hash does not match blockchain record"
  },
  {
    "type": "image_manipulation",
    "level": "warn",
    "description": "Possible pixel-level manipulation detected"
  }
]
```

**Drizzle Schema:**
```typescript
export const fraudAlertStatusEnum = pgEnum('fraud_alert_status', [
  'investigation',
  'resolved',
  'false_positive',
]);

export const fraudAlerts = pgTable('fraud_alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id').notNull().references(() => certificates.id),
  verificationId: uuid('verification_id').references(() => verifications.id),
  riskScore: integer('risk_score').notNull(),
  status: fraudAlertStatusEnum('status').notNull().default('investigation'),
  flags: jsonb('flags').notNull().default('[]'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  resolutionNotes: text('resolution_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.9 audit_logs

Stores comprehensive audit trail.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `user_id` | UUID | YES | NULL | FK → users.id | User who performed action |
| `user_name` | VARCHAR(255) | YES | NULL | | User name (cached) |
| `user_email` | VARCHAR(255) | YES | NULL | | User email (cached) |
| `user_role` | VARCHAR(50) | YES | NULL | | User role (cached) |
| `event` | VARCHAR(100) | NO | | | Event type |
| `action` | TEXT | NO | | | Human-readable description |
| `entity_type` | VARCHAR(100) | YES | NULL | | Entity type (e.g., 'certificate') |
| `entity_id` | UUID | YES | NULL | | Entity ID |
| `ip_address` | VARCHAR(45) | NO | | | IP address |
| `user_agent` | TEXT | YES | NULL | | User agent string |
| `metadata` | JSONB | YES | NULL | | Additional data |
| `result` | ENUM | NO | `'success'` | | Action result |
| `error_message` | TEXT | YES | NULL | | Error message (if failed) |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Event timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- INDEX: `user_id`
- INDEX: `event`
- INDEX: `entity_type, entity_id`
- INDEX: `created_at`
- INDEX: `result`

**Drizzle Schema:**
```typescript
export const auditResultEnum = pgEnum('audit_result', ['success', 'failure']);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  userName: varchar('user_name', { length: 255 }),
  userEmail: varchar('user_email', { length: 255 }),
  userRole: varchar('user_role', { length: 50 }),
  event: varchar('event', { length: 100 }).notNull(),
  action: text('action').notNull(),
  entityType: varchar('entity_type', { length: 100 }),
  entityId: uuid('entity_id'),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  metadata: jsonb('metadata'),
  result: auditResultEnum('result').notNull().default('success'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

### 3.10 sessions (Future)

Stores active user sessions for advanced session management.

| Column | Type | Nullable | Default | Constraint | Description |
|--------|------|----------|---------|------------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | PK | Primary key |
| `user_id` | UUID | NO | | FK → users.id | User |
| `token_hash` | VARCHAR(255) | NO | | UNIQUE | Hashed session token |
| `device` | VARCHAR(255) | YES | NULL | | Device info |
| `ip_address` | VARCHAR(45) | NO | | | IP address |
| `user_agent` | TEXT | YES | NULL | | User agent |
| `last_active` | TIMESTAMPTZ | NO | `NOW()` | | Last activity timestamp |
| `expires_at` | TIMESTAMPTZ | NO | | | Session expiry |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | | Creation timestamp |

**Indexes:**
- PRIMARY KEY: `id`
- UNIQUE: `token_hash`
- INDEX: `user_id`
- INDEX: `expires_at`

**Drizzle Schema:**
```typescript
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  device: varchar('device', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  lastActive: timestamp('last_active', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 4. Indexes

### 4.1 Primary Keys
All tables use UUID primary keys for:
- Distributed system compatibility
- Non-sequential IDs (security)
- Easy replication

### 4.2 Unique Indexes

| Table | Column(s) | Purpose |
|-------|-----------|---------|
| `users` | `email` | Unique login |
| `certificates` | `certificate_number` | Unique certificate ID |
| `certificates` | `sha256_hash` | Unique document hash |
| `certificates` | `qr_token` | Unique QR token |
| `students` | `(institution_id, email)` | Unique email per institution |
| `revocations` | `certificate_id` | One revocation per certificate |
| `sessions` | `token_hash` | Unique session token |

### 4.3 Performance Indexes

**High-frequency queries:**

```sql
-- Certificate lookups
CREATE INDEX idx_certificates_institution ON certificates(institution_id);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_issue_date ON certificates(issue_date);

-- Verification lookups
CREATE INDEX idx_verifications_certificate ON verifications(certificate_id);
CREATE INDEX idx_verifications_created ON verifications(created_at);

-- Audit log queries
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event ON audit_logs(event);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- User lookups
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_role ON users(role);

-- Student lookups
CREATE INDEX idx_students_institution ON students(institution_id);
CREATE INDEX idx_students_email ON students(email);
```

### 4.4 Composite Indexes

```sql
-- Certificate search
CREATE INDEX idx_certificates_institution_status ON certificates(institution_id, status);
CREATE INDEX idx_certificates_institution_type ON certificates(institution_id, certificate_type);

-- Verification analytics
CREATE INDEX idx_verifications_certificate_created ON verifications(certificate_id, created_at);
```

---

## 5. Constraints

### 5.1 Foreign Key Constraints

All foreign keys use `ON DELETE CASCADE` or `ON DELETE SET NULL` based on relationship type:

**CASCADE (delete child records):**
- `students.institution_id` → `institutions.id` (CASCADE)
- `certificates.student_id` → `students.id` (RESTRICT - prevent deletion if certificates exist)
- `verifications.certificate_id` → `certificates.id` (CASCADE)
- `revocations.certificate_id` → `certificates.id` (CASCADE)
- `fraud_alerts.certificate_id` → `certificates.id` (CASCADE)

**SET NULL (preserve record):**
- `certificates.template_id` → `templates.id` (SET NULL)
- `verifications.verifier_id` → `users.id` (SET NULL)

**RESTRICT (prevent deletion):**
- `certificates.institution_id` → `institutions.id` (RESTRICT)
- `certificates.student_id` → `students.id` (RESTRICT)

### 5.2 Check Constraints

```sql
-- Risk score range
ALTER TABLE certificates 
  ADD CONSTRAINT check_risk_score 
  CHECK (risk_score >= 0 AND risk_score <= 100);

ALTER TABLE verifications 
  ADD CONSTRAINT check_trust_score 
  CHECK (trust_score >= 0 AND trust_score <= 100);

ALTER TABLE fraud_alerts 
  ADD CONSTRAINT check_fraud_risk_score 
  CHECK (risk_score >= 0 AND risk_score <= 100);

-- Verification count
ALTER TABLE certificates 
  ADD CONSTRAINT check_verification_count 
  CHECK (verification_count >= 0);

-- Date logic
ALTER TABLE certificates 
  ADD CONSTRAINT check_expiry_after_issue 
  CHECK (expiry_date IS NULL OR expiry_date > issue_date);
```

### 5.3 Default Values

- Timestamps: `NOW()`
- UUIDs: `gen_random_uuid()`
- Status fields: Sensible defaults (e.g., `'active'`, `'issued'`)
- Counters: `0`
- Booleans: `false`

---

## 6. Relationships

### 6.1 One-to-Many Relationships

```
institutions (1) ──→ (N) users
institutions (1) ──→ (N) students
institutions (1) ──→ (N) certificates
institutions (1) ──→ (N) templates

users (1) ──→ (N) certificates (issued_by)
users (1) ──→ (N) verifications (verifier_id)
users (1) ──→ (N) revocations (revoked_by)
users (1) ──→ (N) audit_logs

students (1) ──→ (N) certificates

templates (1) ──→ (N) certificates

certificates (1) ──→ (N) verifications
certificates (1) ──→ (N) fraud_alerts
certificates (1) ──→ (1) revocations
```

### 6.2 Drizzle Relations

```typescript
export const institutionsRelations = relations(institutions, ({ many }) => ({
  users: many(users),
  students: many(students),
  certificates: many(certificates),
  templates: many(templates),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [users.institutionId],
    references: [institutions.id],
  }),
  issuedCertificates: many(certificates, { relationName: 'issuer' }),
  verifications: many(verifications),
  revocations: many(revocations),
  auditLogs: many(auditLogs),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [students.institutionId],
    references: [institutions.id],
  }),
  certificates: many(certificates),
}));

export const certificatesRelations = relations(certificates, ({ one, many }) => ({
  institution: one(institutions, {
    fields: [certificates.institutionId],
    references: [institutions.id],
  }),
  student: one(students, {
    fields: [certificates.studentId],
    references: [students.id],
  }),
  template: one(templates, {
    fields: [certificates.templateId],
    references: [templates.id],
  }),
  issuer: one(users, {
    fields: [certificates.issuedBy],
    references: [users.id],
    relationName: 'issuer',
  }),
  verifications: many(verifications),
  revocation: one(revocations),
  fraudAlerts: many(fraudAlerts),
}));

export const verificationsRelations = relations(verifications, ({ one }) => ({
  certificate: one(certificates, {
    fields: [verifications.certificateId],
    references: [certificates.id],
  }),
  verifier: one(users, {
    fields: [verifications.verifierId],
    references: [users.id],
  }),
}));

export const revocationsRelations = relations(revocations, ({ one }) => ({
  certificate: one(certificates, {
    fields: [revocations.certificateId],
    references: [certificates.id],
  }),
  revokedBy: one(users, {
    fields: [revocations.revokedBy],
    references: [users.id],
  }),
}));

export const fraudAlertsRelations = relations(fraudAlerts, ({ one }) => ({
  certificate: one(certificates, {
    fields: [fraudAlerts.certificateId],
    references: [certificates.id],
  }),
  verification: one(verifications, {
    fields: [fraudAlerts.verificationId],
    references: [verifications.id],
  }),
  resolvedBy: one(users, {
    fields: [fraudAlerts.resolvedBy],
    references: [users.id],
  }),
}));
```

---

## 7. Migration Strategy

### 7.1 Migration Tool

**Drizzle Kit** for migrations

```bash
npm install drizzle-kit
```

**Configuration: `drizzle.config.ts`**
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 7.2 Migration Workflow

**Generate migration:**
```bash
npx drizzle-kit generate:pg
```

**Apply migration:**
```bash
npx drizzle-kit push:pg
```

**Rollback (manual):**
- Create reverse migration file
- Apply reverse migration

### 7.3 Initial Migration

**Migration 0001 - Initial Schema**

Creates all tables in order:
1. ENUMs
2. `institutions`
3. `users`
4. `students`
5. `templates`
6. `certificates`
7. `verifications`
8. `revocations`
9. `fraud_alerts`
10. `audit_logs`
11. `sessions`

**Migration 0002 - Indexes**

Adds all performance indexes.

**Migration 0003 - Constraints**

Adds check constraints.

### 7.4 Data Migration

**Seed Data:**
- Admin user
- Sample institution
- Sample students
- Sample templates

```typescript
// seed.ts
async function seed() {
  // Create admin
  await db.insert(users).values({
    email: 'admin@certifyvault.com',
    passwordHash: await hashPassword('admin123'),
    name: 'System Admin',
    role: 'admin',
    emailVerified: true,
  });
  
  // Create sample institution
  const institution = await db.insert(institutions).values({
    name: 'Demo University',
    type: 'university',
    email: 'info@demouniversity.edu',
    status: 'active',
    verified: true,
  }).returning();
  
  // Create issuer user
  await db.insert(users).values({
    email: 'issuer@demouniversity.edu',
    passwordHash: await hashPassword('issuer123'),
    name: 'John Doe',
    role: 'issuer',
    institutionId: institution[0].id,
    emailVerified: true,
  });
}
```

---

## 8. Data Retention Policy

### 8.1 Retention Periods

| Entity | Retention | Notes |
|--------|-----------|-------|
| `certificates` | Permanent | Legal requirement |
| `verifications` | 5 years | Compliance |
| `audit_logs` | 7 years | Compliance |
| `fraud_alerts` | 7 years | Legal |
| `revocations` | Permanent | Audit trail |
| `sessions` | 30 days | Auto-cleanup |
| `users` (inactive) | 2 years | GDPR compliance |

### 8.2 Cleanup Jobs

**Expired sessions:**
```sql
DELETE FROM sessions WHERE expires_at < NOW();
```

**Old verifications:**
```sql
-- Archive to separate table
INSERT INTO verifications_archive SELECT * FROM verifications 
WHERE created_at < NOW() - INTERVAL '5 years';

DELETE FROM verifications WHERE created_at < NOW() - INTERVAL '5 years';
```

**Inactive users:**
```sql
-- Mark for deletion (soft delete approach)
UPDATE users SET status = 'inactive' 
WHERE last_login < NOW() - INTERVAL '2 years' AND status = 'active';
```

### 8.3 Backup Strategy

- **Daily:** Automated PostgreSQL backups
- **Weekly:** Full database dump
- **Monthly:** Offsite backup to cloud storage
- **Retention:** 30 days of daily backups, 12 months of monthly backups

---

## Appendix

### A. Sample Queries

**Find certificates by student email:**
```sql
SELECT c.*, s.name as student_name, i.name as institution_name
FROM certificates c
JOIN students s ON c.student_id = s.id
JOIN institutions i ON c.institution_id = i.id
WHERE s.email = 'student@example.com';
```

**Verification statistics for an institution:**
```sql
SELECT 
  c.institution_id,
  COUNT(v.id) as total_verifications,
  SUM(CASE WHEN v.result = 'verified' THEN 1 ELSE 0 END) as verified_count,
  SUM(CASE WHEN v.result = 'failed' THEN 1 ELSE 0 END) as failed_count
FROM verifications v
JOIN certificates c ON v.certificate_id = c.id
WHERE c.institution_id = $1
GROUP BY c.institution_id;
```

**Fraud alerts with high risk:**
```sql
SELECT 
  fa.*,
  c.certificate_number,
  s.name as student_name,
  i.name as institution_name
FROM fraud_alerts fa
JOIN certificates c ON fa.certificate_id = c.id
JOIN students s ON c.student_id = s.id
JOIN institutions i ON c.institution_id = i.id
WHERE fa.risk_score >= 70 AND fa.status = 'investigation'
ORDER BY fa.risk_score DESC;
```

**Recent audit activity:**
```sql
SELECT * FROM audit_logs
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 50;
```

### B. Database Size Estimates

**Initial (MVP):**
- Total: ~500 MB

**After 1 Year:**
- Certificates: ~50K records (~100 MB)
- Verifications: ~500K records (~500 MB)
- Audit Logs: ~1M records (~1 GB)
- **Total: ~2 GB**

**After 5 Years:**
- Certificates: ~250K records (~500 MB)
- Verifications: ~5M records (~5 GB)
- Audit Logs: ~10M records (~10 GB)
- **Total: ~15-20 GB**

---

**END OF SCHEMA.MD**

---

## Next Steps

1. **Review** with P1 (database owner)
2. **Create initial migration** (P1)
3. **Test schema** with sample data (P1)
4. **Document any changes** needed
5. **Proceed with Phase 1** backend development

---

**Document Metadata:**
- Created: September 26, 2026
- Version: 1.0
- Owner: P1
- Last Updated: September 26, 2026
