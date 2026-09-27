# CertifyVault Backend Development Plan

**Document Version:** 1.0  
**Date:** September 26, 2026  
**Scope:** Website Backend Implementation ONLY  
**Team Size:** 4 Developers (P1, P2, P3, P4)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Current Frontend Analysis](#2-current-frontend-analysis)
3. [Backend Architecture](#3-backend-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Authentication](#5-authentication)
6. [Roles & Authorization](#6-roles--authorization)
7. [Certificate Lifecycle](#7-certificate-lifecycle)
8. [Certificate APIs](#8-certificate-apis)
9. [Verification Architecture](#9-verification-architecture)
10. [QR Architecture](#10-qr-architecture)
11. [Hashing](#11-hashing)
12. [File Management](#12-file-management)
13. [Fraud / Risk Architecture](#13-fraud--risk-architecture)
14. [Reports](#14-reports)
15. [Analytics](#15-analytics)
16. [Audit Logs](#16-audit-logs)
17. [Security](#17-security)
18. [API Error Standard](#18-api-error-standard)
19. [API Documentation](#19-api-documentation)
20. [Testing Strategy](#20-testing-strategy)
21. [Development Phases](#21-development-phases)
22. [Team Task Board](#22-team-task-board)
23. [Dependency Graph](#23-dependency-graph)
24. [Parallel Development Plan](#24-parallel-development-plan)
25. [Git / Branch Strategy](#25-git--branch-strategy)

---

## 1. Project Overview

### 1.1 What is CertifyVault?

CertifyVault is a **certificate issuance, storage, verification, and fraud-analysis platform** designed for educational institutions and certification bodies.

**Core Flow:**
```
Institution / University
        ↓
  CertifyVault Platform
        ↓
  Certificate Issuance
        ↓
  Secure Certificate Storage
        ↓
  QR + SHA-256 Verification
        ↓
  Database + Blockchain Verification
        ↓
  AI / Fraud Analysis
        ↓
  Verification Report
```

### 1.2 Current Status

✅ **COMPLETED:** Frontend website (React + TypeScript)  
🚧 **IN PROGRESS:** Backend API development  
⏳ **FUTURE:** Mobile app backend integration  
⏳ **FUTURE:** Advanced AI fraud detection  
⏳ **FUTURE:** Full blockchain integration (Hyperledger/Polygon)

### 1.3 Technology Stack

**Backend:**
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Drizzle ORM (already present in existing Backend/server)
- **Authentication:** JWT (jsonwebtoken)
- **File Storage:** Local filesystem (MVP) → S3/Cloud (Future)
- **PDF Generation:** PDFKit or Puppeteer
- **QR Generation:** qrcode npm package
- **Hashing:** Node.js crypto (SHA-256)
- **Validation:** Zod (already in use in frontend)

**Future Integrations:**
- Python AI Service (OCR, fraud detection)
- Blockchain Service (Hyperledger Fabric / Polygon)
- Redis (for job queues)

### 1.4 Architecture Principle

We are building a **MODULAR MONOLITH**:
- Single Node.js + Express application
- Clear service boundaries
- Clean interfaces for future extraction
- No premature microservices
- No unnecessary infrastructure complexity

---

## 2. Current Frontend Analysis

### 2.1 Complete Page Inventory

| Page Route | Role | Purpose | Backend Requirement | Priority |
|------------|------|---------|---------------------|----------|
| `/app/login` | Public | User login | POST `/api/auth/login` | P0 |
| `/app/register` | Public | User registration | POST `/api/auth/register` | P0 |
| `/app/forgot-password` | Public | Password reset | POST `/api/auth/forgot-password` | P1 |
| `/verify` | Public | Certificate verification | POST `/api/verify` | P0 |
| `/issuerdashboard` | Issuer | Dashboard overview | GET `/api/issuer/dashboard/stats` | P0 |
| `/issuerdashboard/certificates` | Issuer | Certificate list | GET `/api/issuer/certificates` | P0 |
| `/issuerdashboard/issue` | Issuer | Single certificate issuance | POST `/api/issuer/certificates/issue` | P0 |
| `/issuerdashboard/issue` (bulk) | Issuer | Bulk certificate issuance | POST `/api/issuer/certificates/bulk-issue` | P1 |
| `/issuerdashboard/templates` | Issuer | Certificate templates | GET `/api/issuer/templates` | P1 |
| `/issuerdashboard/templates/:id` | Issuer | Template editor | GET/PUT `/api/issuer/templates/:id` | P1 |
| `/issuerdashboard/verification` | Issuer | Verification records | GET `/api/issuer/verifications` | P0 |
| `/issuerdashboard/revocations` | Issuer | Certificate revocations | GET `/api/issuer/revocations` | P0 |
| `/issuerdashboard/revocations/:id` | Issuer | Revoke certificate | POST `/api/issuer/certificates/:id/revoke` | P0 |
| `/issuerdashboard/fraud-alerts` | Issuer | Fraud alerts | GET `/api/issuer/fraud-alerts` | P1 |
| `/issuerdashboard/analytics` | Issuer | Analytics dashboard | GET `/api/issuer/analytics` | P1 |
| `/issuerdashboard/audit-logs` | Issuer | Audit logs | GET `/api/issuer/audit-logs` | P0 |
| `/issuerdashboard/students` | Issuer | Student management | GET/POST `/api/issuer/students` | P0 |
| `/issuerdashboard/students/:id` | Issuer | Student details | GET `/api/issuer/students/:id` | P0 |
| `/issuerdashboard/settings/*` | Issuer | Settings pages | GET/PATCH `/api/issuer/settings/*` | P1 |
| `/holderdashboard` | Holder | Holder dashboard | GET `/api/holder/certificates` | P1 |
| `/holderdashboard/certificates` | Holder | Certificate list | GET `/api/holder/certificates` | P1 |
| `/holderdashboard/verification` | Holder | Verification history | GET `/api/holder/verifications` | P2 |
| `/holderdashboard/share` | Holder | Share certificates | GET `/api/holder/share/:id` | P2 |
| `/holderdashboard/activity` | Holder | Activity log | GET `/api/holder/activity` | P2 |
| `/holderdashboard/profile` | Holder | Profile management | GET/PATCH `/api/holder/profile` | P2 |
| `/verifierdashboard` | Verifier | Verifier dashboard | GET `/api/verifier/stats` | P1 |
| `/verifierdashboard/verify` | Verifier | Verify certificate | POST `/api/verify` | P0 |
| `/verifierdashboard/history` | Verifier | Verification history | GET `/api/verifier/history` | P1 |
| `/verifierdashboard/saved` | Verifier | Saved verifications | GET `/api/verifier/saved` | P2 |
| `/verifierdashboard/reports` | Verifier | Verification reports | GET `/api/verifier/reports` | P2 |
| `/verifierdashboard/profile` | Verifier | Profile | GET/PATCH `/api/verifier/profile` | P2 |
| `/admindashboard` | Admin | Admin overview | GET `/api/admin/dashboard` | P1 |
| `/admindashboard/institutions` | Admin | Institution management | GET/POST `/api/admin/institutions` | P1 |
| `/admindashboard/users` | Admin | User management | GET/POST/PATCH/DELETE `/api/admin/users` | P1 |
| `/admindashboard/issuers` | Admin | Issuer management | GET `/api/admin/issuers` | P1 |
| `/admindashboard/verification` | Admin | Global verification stats | GET `/api/admin/verifications` | P2 |
| `/admindashboard/fraud` | Admin | Fraud overview | GET `/api/admin/fraud` | P2 |
| `/admindashboard/blockchain` | Admin | Blockchain stats | GET `/api/admin/blockchain` | P2 |
| `/admindashboard/health` | Admin | System health | GET `/api/admin/health` | P1 |
| `/admindashboard/audit` | Admin | Platform audit logs | GET `/api/admin/audit` | P1 |
| `/admindashboard/settings` | Admin | Platform settings | GET/PATCH `/api/admin/settings` | P2 |

**Priority Legend:**
- **P0:** Critical - Required for MVP
- **P1:** High - Required soon after MVP
- **P2:** Medium - Can be phased in later
- **P3:** Low - Future enhancement

### 2.2 Data Models Identified

From frontend analysis, the following entities are required:

**Core Entities:**
- `users` - Authentication and user accounts
- `institutions` - Educational institutions / organizations
- `certificates` - Issued certificates
- `students` - Certificate recipients
- `templates` - Certificate design templates
- `verifications` - Verification records
- `revocations` - Revoked certificates
- `audit_logs` - System audit trail
- `fraud_alerts` - Fraud detection alerts
- `sessions` - User sessions (security)

**Relationship Summary:**
```
institutions (1) ──→ (N) users (issuers)
institutions (1) ──→ (N) students
institutions (1) ──→ (N) certificates
institutions (1) ──→ (N) templates
certificates (1) ──→ (N) verifications
certificates (1) ──→ (1) revocations (optional)
certificates (N) ──→ (1) students
certificates (N) ──→ (1) templates
verifications (N) ──→ (1) verifiers
```

### 2.3 Status Enumerations Found

**Certificate Status:**
- `issued` - Certificate successfully issued
- `pending` - Certificate creation in progress
- `verified` - Certificate has been verified
- `revoked` - Certificate revoked
- `expired` - Certificate past expiry date
- `suspicious` - Flagged for fraud

**Blockchain Status:**
- `confirmed` - Hash anchored on blockchain
- `pending` - Transaction pending confirmation
- `failed` - Blockchain transaction failed

**Verification Result:**
- `verified` - All checks passed
- `review` - Needs manual review
- `failed` - Verification failed

**Fraud Risk Level:**
- `high` - Risk score >= 70
- `medium` - Risk score 40-69
- `low` - Risk score < 40

**User Status:**
- `active` - Active user
- `inactive` - Inactive user
- `invited` - Invitation sent
- `suspended` - Account suspended

### 2.4 Form Data Requirements

**Certificate Issuance Form:**
```typescript
{
  studentId: string,
  certificateType: 'degree' | 'diploma' | 'course' | 'internship' | 'training' | 'achievement',
  title: string,
  program: string,
  grade?: string,
  issueDate: Date,
  expiryDate?: Date,
  notes?: string,
  templateId?: string
}
```

**Bulk Issuance:**
- CSV/Excel upload with validation
- Fields: studentName, rollNo, program, grade, issueDate

**Student Registration:**
```typescript
{
  name: string,
  email: string,
  rollNo: string,
  program: string,
  branch?: string
}
```

**Template Configuration:**
```typescript
{
  name: string,
  backgroundImage: File,
  elements: Array<{
    type: 'logo' | 'qr' | 'signature',
    x: number,
    y: number,
    width: number,
    height: number
  }>,
  fields: Array<{
    name: string,
    enabled: boolean
  }>
}
```

**Institution Settings:**
```typescript
{
  logo: File,
  name: string,
  type: 'University' | 'College' | 'Training Institute' | 'School',
  address: string,
  website: string,
  email: string,
  phone: string
}
```

### 2.5 Analytics Requirements

The frontend displays these statistics (from `analytics.tsx`):

**Issuer Analytics:**
- Total certificates issued (trend over time)
- Verification trends (successful, failed, suspicious)
- Certificate types breakdown (pie chart)
- Fraud detection by risk level (stacked bar chart)
- Revocations by reason (horizontal bar chart)
- Blockchain transactions (daily trend)
- Blockchain stats (total tx, success rate, avg confirmation time)

**Admin Analytics:**
- Total institutions
- Verified certificates count
- Active users
- Pending reviews
- Institution engagement metrics
- Operational health (uptime, API response, verification job success, auth success)
- Recent activity feed
- Priority alerts

**Verifier Analytics:**
- Total verifications
- Verified count
- Review count
- Failed count
- Activity chart (verifications per day)

### 2.6 API Comments Found in Frontend

The frontend has `// 🔧` comments indicating intended API integrations:

**Certificate APIs:**
- `GET /api/certificates` - List certificates
- `POST /api/issuer/certificates/issue` - Issue certificate
- `POST /api/issuer/certificates/bulk-issue` - Bulk issue
- `GET /api/certificates/:id` - Get certificate details
- `POST /api/certificates/:id/revoke` - Revoke certificate
- `GET /api/certificates/:id/blockchain` - Get blockchain proof

**Verification APIs:**
- `POST /api/verify/:id` - Verify certificate
- `GET /api/issuer/verifications` - List verification records
- `GET /api/verifier/history` - Verifier history

**Student APIs:**
- `GET /api/issuer/students` - List students
- `POST /api/issuer/students` - Add student
- `POST /api/issuer/students/import` - Bulk import
- `GET /api/issuer/students/:id` - Student details

**Settings APIs:**
- `GET /api/issuer/profile` - Get profile
- `PATCH /api/issuer/profile` - Update profile
- `POST /api/issuer/change-password` - Change password
- `GET /api/issuer/institution` - Get institution
- `PATCH /api/issuer/institution` - Update institution
- `GET /api/issuer/users` - List users/staff
- `POST /api/issuer/users/invite` - Invite user
- `PATCH /api/issuer/users/:id` - Update user role
- `DELETE /api/issuer/users/:id` - Remove user
- `GET /api/issuer/notification-settings` - Get settings
- `PATCH /api/issuer/notification-settings` - Update settings
- `GET /api/issuer/security/sessions` - List sessions
- `DELETE /api/issuer/security/sessions/:id` - Revoke session
- `GET /api/issuer/security/login-activity` - Login history
- `GET /api/issuer/branding` - Get branding
- `PATCH /api/issuer/branding` - Update branding

**Template APIs:**
- `GET /api/issuer/templates` - List templates
- `GET /api/issuer/templates/:id` - Get template
- `PUT /api/issuer/templates/:id` - Update template

**Audit & Fraud APIs:**
- `GET /api/issuer/audit-logs` - Get audit logs
- `GET /api/issuer/audit-logs/export` - Export CSV
- `GET /api/issuer/fraud-alerts` - Get fraud alerts

**Holder APIs:**
- `GET /api/holders/:id/certificates` - List holder certificates

---

## 3. Backend Architecture

### 3.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  Issuer Dashboard | Holder Dashboard | Verifier Dashboard  │
│                   Admin Dashboard                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / JWT
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS REST API                         │
│  ┌──────────┐  ┌───────────┐  ┌─────────────┐             │
│  │  Routes  │→ │Controllers│→ │  Services   │             │
│  └──────────┘  └───────────┘  └──────┬──────┘             │
│                                       ↓                      │
│                              ┌────────────────┐             │
│                              │ Repositories   │             │
│                              └────────┬───────┘             │
└──────────────────────────────────────┼─────────────────────┘
                                       ↓
                   ┌─────────────────────────────────┐
                   │      PostgreSQL Database        │
                   │  (Users, Certificates, etc.)    │
                   └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ File Storage │  │  QR Service  │  │  PDF Generator  │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         FUTURE / MODULAR EXTENSIONS                  │  │
│  │  ┌────────────────┐      ┌────────────────────┐     │  │
│  │  │  AI Service    │      │ Blockchain Service │     │  │
│  │  │  (Python)      │      │ (Hyperledger/Poly) │     │  │
│  │  │ - OCR          │      │ - Hash anchoring   │     │  │
│  │  │ - Fraud ML     │      │ - Proof retrieval  │     │  │
│  │  └────────────────┘      └────────────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Service Boundaries

**Core Services (MVP):**
1. **AuthService** - Authentication, JWT, sessions
2. **UserService** - User management, profiles
3. **InstitutionService** - Institution CRUD
4. **StudentService** - Student management
5. **CertificateService** - Certificate CRUD, issuance
6. **TemplateService** - Template management
7. **VerificationService** - Verification workflow
8. **RevocationService** - Certificate revocation
9. **FileService** - File upload, storage, retrieval
10. **QRService** - QR generation, validation
11. **HashService** - SHA-256 hashing
12. **AuditService** - Audit logging
13. **AnalyticsService** - Statistics and reporting

**Future Services:**
14. **BlockchainService** - Blockchain integration (interface ready)
15. **AIService** - Fraud detection (interface ready)
16. **NotificationService** - Email/SMS notifications
17. **QueueService** - Background jobs

### 3.3 Layer Responsibilities

**Routes Layer:**
- HTTP request routing
- Request validation (Zod schemas)
- Authentication middleware
- Authorization middleware
- Response formatting

**Controllers Layer:**
- Request/response handling
- Input parsing and validation
- Calling appropriate services
- Error handling
- HTTP status codes

**Services Layer:**
- Business logic
- Data validation
- Service orchestration
- Transaction management
- External service calls

**Repositories Layer:**
- Database queries (Drizzle ORM)
- Data mapping
- Query optimization
- Transaction support

---

## 4. Folder Structure

```
Backend/server/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   ├── env.ts               # Environment variables
│   │   └── constants.ts         # App constants
│   │
│   ├── db/
│   │   ├── index.ts             # Database instance
│   │   ├── schema.ts            # Drizzle schemas (ALREADY EXISTS)
│   │   └── migrations/          # Database migrations
│   │
│   ├── types/
│   │   ├── express.d.ts         # Express type extensions
│   │   ├── certificate.ts       # Certificate types
│   │   ├── user.ts              # User types
│   │   └── common.ts            # Shared types
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT authentication
│   │   ├── role.middleware.ts   # Role-based authorization
│   │   ├── validate.middleware.ts # Request validation
│   │   ├── error.middleware.ts  # Global error handler
│   │   └── rate-limit.middleware.ts # Rate limiting
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── certificate.validator.ts
│   │   ├── student.validator.ts
│   │   └── user.validator.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── certificate.controller.ts
│   │   ├── verification.controller.ts
│   │   ├── student.controller.ts
│   │   ├── institution.controller.ts
│   │   ├── template.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── issuer.controller.ts
│   │   ├── holder.controller.ts
│   │   └── verifier.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── institution.service.ts
│   │   ├── student.service.ts
│   │   ├── certificate.service.ts
│   │   ├── template.service.ts
│   │   ├── verification.service.ts
│   │   ├── revocation.service.ts
│   │   ├── file.service.ts
│   │   ├── qr.service.ts
│   │   ├── hash.service.ts
│   │   ├── pdf.service.ts
│   │   ├── audit.service.ts
│   │   ├── analytics.service.ts
│   │   ├── blockchain.service.ts (interface only - future)
│   │   └── ai.service.ts (interface only - future)
│   │
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── institution.repository.ts
│   │   ├── student.repository.ts
│   │   ├── certificate.repository.ts
│   │   ├── template.repository.ts
│   │   ├── verification.repository.ts
│   │   ├── revocation.repository.ts
│   │   └── audit.repository.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── certificate.routes.ts
│   │   ├── verification.routes.ts
│   │   ├── issuer.routes.ts
│   │   ├── holder.routes.ts
│   │   ├── verifier.routes.ts
│   │   ├── admin.routes.ts
│   │   └── index.ts             # Route aggregator
│   │
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   ├── response.ts          # Response formatters
│   │   ├── crypto.ts            # Crypto utilities
│   │   └── helpers.ts           # General helpers
│   │
│   ├── integrations/
│   │   ├── blockchain/
│   │   │   ├── interface.ts     # Blockchain interface
│   │   │   └── mock.ts          # Mock implementation
│   │   └── ai/
│   │       ├── interface.ts     # AI service interface
│   │       └── mock.ts          # Mock implementation
│   │
│   ├── jobs/                    # Future: Background jobs
│   │   └── README.md
│   │
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
│
├── uploads/                     # File storage (gitignored)
│   ├── certificates/
│   ├── templates/
│   ├── logos/
│   └── temp/
│
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── README.md
```

---

## 5. Authentication

### 5.1 Authentication Flow

```
1. User submits email + password
2. Server validates credentials
3. Server generates JWT with user payload
4. Client stores JWT (localStorage/cookie)
5. Client sends JWT in Authorization header
6. Server validates JWT on protected routes
7. Server extracts user info from JWT
```

### 5.2 JWT Payload Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'issuer' | 'holder' | 'verifier';
  institutionId?: string;
  iat: number;
  exp: number;
}
```

### 5.3 Authentication Endpoints

**POST /api/auth/register**
```typescript
Request: {
  email: string;
  password: string;
  name: string;
  role: 'issuer' | 'holder' | 'verifier';
  institutionName?: string; // for issuers
}

Response: {
  success: true;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }
}
```

**POST /api/auth/login**
```typescript
Request: {
  email: string;
  password: string;
}

Response: {
  success: true;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }
}
```

**POST /api/auth/forgot-password**
```typescript
Request: {
  email: string;
}

Response: {
  success: true;
  message: 'Password reset email sent'
}
```

**POST /api/auth/reset-password**
```typescript
Request: {
  token: string;
  newPassword: string;
}

Response: {
  success: true;
  message: 'Password reset successful'
}
```

**POST /api/auth/logout**
```typescript
Request: {
  // JWT in header
}

Response: {
  success: true;
  message: 'Logged out successfully'
}
```

### 5.4 Password Security

- **Hashing:** bcrypt with salt rounds = 10
- **Minimum Length:** 8 characters
- **Requirements:** At least 1 uppercase, 1 lowercase, 1 number (optional for MVP)
- **Reset Tokens:** 6-hour expiry
- **Failed Login:** Track attempts (future: account lockout)

### 5.5 Session Management

**MVP:** Stateless JWT (no session storage)

**Future Enhancement:**
- Store active sessions in database
- Allow users to view/revoke sessions
- Track login history (IP, device, timestamp)

---

## 6. Roles & Authorization

### 6.1 Role Definitions

| Role | Description | Key Permissions |
|------|-------------|----------------|
| **Admin** | Platform administrator | Full platform access, manage institutions, users, system settings |
| **Issuer** | Institution staff | Issue certificates, manage students, templates, view verifications |
| **Holder** | Certificate recipient | View own certificates, share, track activity |
| **Verifier** | Third-party verifier | Verify certificates, view verification history |

### 6.2 Permission Matrix

| Action | Admin | Issuer | Holder | Verifier |
|--------|-------|--------|--------|----------|
| **Authentication** |
| Register | ✓ | ✓ | ✓ | ✓ |
| Login | ✓ | ✓ | ✓ | ✓ |
| **Institutions** |
| View all institutions | ✓ | | | |
| Create institution | ✓ | | | |
| Update own institution | ✓ | ✓ | | |
| Delete institution | ✓ | | | |
| **Users** |
| View all users | ✓ | | | |
| Invite user (own institution) | ✓ | ✓ | | |
| Update user role | ✓ | ✓ | | |
| Delete user | ✓ | ✓ | | |
| **Students** |
| View students (own institution) | | ✓ | | |
| Create student | | ✓ | | |
| Update student | | ✓ | | |
| Delete student | | ✓ | | |
| Import students (bulk) | | ✓ | | |
| **Certificates** |
| Issue certificate | | ✓ | | |
| View own institution's certificates | | ✓ | | |
| View own certificates | | | ✓ | |
| View certificate details (public) | ✓ | ✓ | ✓ | ✓ |
| Revoke certificate | ✓ | ✓ | | |
| Download certificate | | ✓ | ✓ | |
| **Templates** |
| Create template | | ✓ | | |
| Update template | | ✓ | | |
| Delete template | | ✓ | | |
| **Verification** |
| Verify certificate (public) | ✓ | ✓ | ✓ | ✓ |
| View verification records (own) | | ✓ | | ✓ |
| View all verifications | ✓ | | | |
| **Analytics** |
| View own institution analytics | | ✓ | | |
| View own verification analytics | | | | ✓ |
| View platform analytics | ✓ | | | |
| **Audit Logs** |
| View own institution logs | | ✓ | | |
| View platform logs | ✓ | | | |
| **Settings** |
| Update own profile | ✓ | ✓ | ✓ | ✓ |
| Update institution settings | | ✓ | | |
| Update platform settings | ✓ | | | |

### 6.3 Authorization Middleware

```typescript
// Role-based middleware
export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden' 
      });
    }

    next();
  };
};

// Institution ownership check
export const checkInstitutionOwnership = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  // Verify user belongs to the institution they're trying to access
};
```

### 6.4 Route Protection Examples

```typescript
// Only issuers can issue certificates
router.post('/certificates/issue', 
  authenticate, 
  authorize('issuer'), 
  certificateController.issue
);

// Only admin can manage institutions
router.post('/admin/institutions', 
  authenticate, 
  authorize('admin'), 
  adminController.createInstitution
);

// Public verification (no auth)
router.post('/verify/:id', 
  verificationController.verify
);
```

---

## 7. Certificate Lifecycle

### 7.1 Certificate States

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  [DRAFT] ──→ [PENDING] ──→ [ISSUED] ──→ [VERIFIED]
│                                  │
│                                  ↓
│                            [REVOKED]
│                                  │
│                            [EXPIRED]
│                                                 │
└─────────────────────────────────────────────────┘
```

**Status Definitions:**

| Status | Description | Can Transition To |
|--------|-------------|-------------------|
| `draft` | Certificate being created (optional) | `pending` |
| `pending` | Certificate generation in progress | `issued`, `failed` |
| `issued` | Certificate successfully issued | `verified`, `revoked`, `expired` |
| `verified` | Certificate has been verified | `revoked`, `expired` |
| `revoked` | Certificate manually revoked | (terminal) |
| `expired` | Certificate past expiry date | (terminal) |
| `suspicious` | Flagged for fraud | `revoked` |

### 7.2 Certificate Issuance Pipeline

```
User Input
   ↓
Validation
   ↓
Generate PDF ──→ Store PDF
   ↓
Compute SHA-256 Hash
   ↓
Generate QR Code
   ↓
Store Certificate Record
   ↓
[FUTURE] Blockchain Anchoring
   ↓
Certificate Issued
   ↓
Send Notification (future)
```

### 7.3 Certificate ID Format

**Pattern:** `CERT-YYYY-XXXXXX`

Example: `CERT-2026-001245`

- `CERT` = Prefix (configurable)
- `YYYY` = Year
- `XXXXXX` = Sequential number (6 digits, zero-padded)

### 7.4 Certificate Metadata

```typescript
interface Certificate {
  id: string;
  certificateNumber: string; // CERT-2026-001245
  institutionId: string;
  studentId: string;
  templateId?: string;
  
  certificateType: CertificateType;
  title: string;
  program: string;
  grade?: string;
  
  issueDate: Date;
  expiryDate?: Date;
  
  pdfPath: string;
  sha256Hash: string;
  qrToken: string;
  
  status: CertificateStatus;
  
  blockchainTxHash?: string;
  blockchainNetwork?: string;
  blockchainStatus?: 'confirmed' | 'pending' | 'failed';
  
  verificationCount: number;
  riskScore?: number;
  
  issuedBy: string; // userId
  revokedAt?: Date;
  revokedBy?: string;
  revocationReason?: string;
  
  notes?: string;
  metadata?: Record<string, any>;
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 8. Certificate APIs

### 8.1 Issue Certificate (Single)

**POST /api/issuer/certificates/issue**

```typescript
Authorization: Bearer <JWT>
Role: issuer

Request: {
  studentId: string;
  certificateType: 'degree' | 'diploma' | 'course' | 'internship' | 'training' | 'achievement';
  title: string;
  program: string;
  grade?: string;
  issueDate: string;
  expiryDate?: string;
  templateId?: string;
  notes?: string;
}

Response: {
  success: true;
  data: {
    certificate: Certificate;
    downloadUrl: string;
  }
}

Errors:
- 400: Invalid input
- 401: Unauthorized
- 403: Forbidden
- 404: Student not found
- 500: Server error
```

**Implementation Steps:**
1. Validate input
2. Check student exists and belongs to issuer's institution
3. Generate certificate number
4. Create PDF from template
5. Compute SHA-256 hash
6. Generate QR code
7. Store files
8. Create database record
9. [Future] Submit to blockchain
10. Return certificate object

### 8.2 Bulk Issue Certificates

**POST /api/issuer/certificates/bulk-issue**

```typescript
Authorization: Bearer <JWT>
Role: issuer

Request: FormData {
  file: File; // CSV or Excel
  certificateType: string;
  templateId?: string;
}

Response: {
  success: true;
  data: {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{
      row: number;
      error: string;
    }>;
    certificates: Certificate[];
  }
}
```

**CSV Format:**
```csv
studentName,studentEmail,rollNo,program,grade,issueDate
John Doe,john@example.com,CS2021001,Computer Science,8.5,2026-06-15
```

### 8.3 List Certificates

**GET /api/issuer/certificates**

```typescript
Authorization: Bearer <JWT>
Role: issuer

Query Params:
  ?page=1&limit=20&status=issued&search=CERT-2026&sortBy=createdAt&order=desc

Response: {
  success: true;
  data: {
    certificates: Certificate[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  }
}
```

### 8.4 Get Certificate Details

**GET /api/certificates/:id**

```typescript
Authorization: Optional (public for verification)

Response: {
  success: true;
  data: {
    certificate: Certificate;
    student: Student;
    institution: Institution;
  }
}
```

### 8.5 Revoke Certificate

**POST /api/issuer/certificates/:id/revoke**

```typescript
Authorization: Bearer <JWT>
Role: issuer, admin

Request: {
  reason: string;
  notes?: string;
}

Response: {
  success: true;
  data: {
    certificate: Certificate;
    revocation: Revocation;
  }
}
```

### 8.6 Download Certificate

**GET /api/certificates/:id/download**

```typescript
Authorization: Bearer <JWT>
Role: issuer (own institution), holder (own certificates)

Response: PDF File
Content-Type: application/pdf
Content-Disposition: attachment; filename="CERT-2026-001245.pdf"
```

### 8.7 Get Blockchain Proof

**GET /api/certificates/:id/blockchain**

```typescript
Authorization: Optional

Response: {
  success: true;
  data: {
    certificateHash: string;
    transactionId: string;
    network: string;
    blockNumber: string;
    timestamp: string;
    explorerUrl: string;
    status: 'confirmed' | 'pending' | 'failed';
  }
}
```

---

## 9. Verification Architecture

### 9.1 Verification Flow

```
Certificate Input
    ↓
Input Type?
    ├─→ QR Code ──→ Extract Token ──→ Lookup Certificate
    ├─→ Certificate ID ──→ Lookup Certificate
    └─→ File Upload ──→ Compute Hash ──→ Lookup by Hash
         ↓
Certificate Found?
    │ NO → Return "Not Found"
    │ YES ↓
         ↓
Check Revocation Status
         ↓
Revoked? → Return "Revoked"
         ↓
Verify SHA-256 Hash
         ↓
Hash Match?
    │ NO → Flag Suspicious
    │ YES ↓
         ↓
[FUTURE] Blockchain Verification
         ↓
[FUTURE] AI Fraud Analysis
         ↓
Calculate Risk Score
         ↓
Return Verification Result
         ↓
Store Verification Record
```

### 9.2 Verification Checks

| Check | Description | Weight | Status |
|-------|-------------|--------|--------|
| **Certificate Found** | Certificate exists in database | Critical | MVP |
| **Issuer Verified** | Issuer is legitimate | Critical | MVP |
| **QR Code Valid** | QR token matches | High | MVP |
| **Document Integrity** | SHA-256 hash matches | Critical | MVP |
| **Revocation Check** | Certificate not revoked | Critical | MVP |
| **Expiry Check** | Certificate not expired | High | MVP |
| **Blockchain Proof** | On-chain hash verified | High | Future |
| **OCR Data Match** | Extracted text matches | Medium | Future |
| **Fraud Analysis** | AI anomaly detection | Medium | Future |

### 9.3 Verification API

**POST /api/verify**

```typescript
Authorization: Optional (public endpoint)

Request: {
  method: 'qr' | 'id' | 'upload';
  
  // For QR method
  qrToken?: string;
  
  // For ID method
  certificateId?: string;
  
  // For upload method
  file?: File;
}

Response: {
  success: true;
  data: {
    verificationId: string;
    status: 'verified' | 'review' | 'failed';
    trustScore: {
      score: number; // 0-100
      label: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'High Risk';
      color: string;
    };
    certificate: {
      id: string;
      type: string;
      holderName: string;
      degree: string;
      institution: string;
      issuedDate: string;
    };
    checks: Array<{
      label: string;
      status: 'pass' | 'fail' | 'warn';
      detail: string;
    }>;
    blockchainProof?: {
      network: string;
      certificateHash: string;
      transactionId: string;
      anchoredAt: string;
      explorerUrl?: string;
    };
    fraudSignals?: Array<{
      type: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
    }>;
    verifiedAt: string;
    method: string;
  }
}
```

### 9.4 Trust Score Calculation

```typescript
function calculateTrustScore(checks: VerificationCheck[]): number {
  let score = 100;
  
  // Critical failures
  if (!checks.find(c => c.label === 'Certificate Found')?.status === 'pass') {
    return 0;
  }
  
  if (checks.find(c => c.label === 'Document Integrity')?.status === 'fail') {
    score -= 60;
  }
  
  if (checks.find(c => c.label === 'Blockchain Proof')?.status === 'fail') {
    score -= 30;
  }
  
  // Warning deductions
  checks.filter(c => c.status === 'warn').forEach(() => {
    score -= 10;
  });
  
  return Math.max(0, Math.min(100, score));
}
```

### 9.5 Verification Record

```typescript
interface VerificationRecord {
  id: string;
  certificateId: string;
  verifierId?: string;
  verifierOrganization?: string;
  
  method: 'qr' | 'id' | 'upload';
  result: 'verified' | 'review' | 'failed';
  trustScore: number;
  
  checks: Record<string, CheckResult>;
  fraudSignals?: FraudSignal[];
  
  ipAddress: string;
  userAgent: string;
  
  createdAt: Date;
}
```

---

## 10. QR Architecture

### 10.1 QR Code Generation

**QR Code should contain a verification URL, not just the certificate ID.**

**Format:**
```
https://certifyvault.com/v/<QR_TOKEN>
```

**QR Token Structure:**
```typescript
// JWT-based QR token (signed, tamper-proof)
interface QRPayload {
  certId: string;
  instId: string;
  iat: number;
  exp?: number; // optional expiry
}

// Or simple UUID-based token (stored in DB)
qrToken: UUID
```

**MVP Approach:** Use UUID stored in database (simpler, no JWT overhead)

### 10.2 QR Generation Process

```typescript
async function generateQRCode(certificateId: string): Promise<string> {
  // Generate unique token
  const qrToken = crypto.randomUUID();
  
  // Store token in certificate record
  await db.update(certificates)
    .set({ qrToken })
    .where(eq(certificates.id, certificateId));
  
  // Generate QR image
  const verificationUrl = `${process.env.FRONTEND_URL}/v/${qrToken}`;
  const qrImageBuffer = await QRCode.toBuffer(verificationUrl, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 300,
  });
  
  // Save QR image
  const qrPath = `uploads/qr/${qrToken}.png`;
  await fs.writeFile(qrPath, qrImageBuffer);
  
  return qrToken;
}
```

### 10.3 QR Verification

**GET /v/:qrToken** (Frontend route)
- Frontend receives token
- Redirects to verification page
- Calls **POST /api/verify** with `{ method: 'qr', qrToken }`

**Backend:**
```typescript
async function verifyByQR(qrToken: string): Promise<Certificate> {
  const certificate = await db.query.certificates.findFirst({
    where: eq(certificates.qrToken, qrToken),
  });
  
  if (!certificate) {
    throw new Error('Certificate not found');
  }
  
  return certificate;
}
```

### 10.4 QR Security

- **Tampering Protection:** UUID is random and unpredictable
- **Token Validation:** Check token exists in database
- **Rate Limiting:** Limit verification requests per IP
- **Logging:** Log all verification attempts

---

## 11. Hashing

### 11.1 SHA-256 Hashing Strategy

**IMPORTANT:** Hash the **final certificate PDF**, not the metadata.

**Why?**
- PDF is the actual artifact that holders receive
- Hashing PDF ensures document integrity
- Any modification to PDF changes the hash

### 11.2 Hash Computation

```typescript
import crypto from 'crypto';
import fs from 'fs/promises';

async function computePDFHash(pdfPath: string): Promise<string> {
  const fileBuffer = await fs.readFile(pdfPath);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}
```

### 11.3 Hash Verification

**Scenario 1:** Exact PDF Match
```typescript
// User uploads the exact original PDF
const uploadedPDFHash = await computePDFHash(uploadedFile.path);
const storedHash = certificate.sha256Hash;

if (uploadedPDFHash === storedHash) {
  // VERIFIED ✓
}
```

**Scenario 2:** Scan/Photo Upload
```typescript
// User uploads a photo or scan (hash will NOT match)
// In this case, rely on:
// 1. QR code extraction
// 2. OCR text extraction
// 3. Certificate ID lookup
// 4. Visual/AI analysis (future)
```

### 11.4 Hash Storage

```sql
ALTER TABLE certificates ADD COLUMN sha256_hash VARCHAR(64) NOT NULL;
ALTER TABLE certificates ADD INDEX idx_sha256_hash (sha256_hash);
```

### 11.5 Blockchain Anchoring (Future)

```typescript
interface BlockchainAnchor {
  certificateId: string;
  sha256Hash: string;
  blockchainNetwork: 'polygon' | 'hyperledger';
  transactionHash: string;
  blockNumber: string;
  timestamp: Date;
}
```

---

## 12. File Management

### 12.1 File Types

| File Type | Purpose | Storage Path | Max Size |
|-----------|---------|--------------|----------|
| Certificate PDF | Issued certificate | `uploads/certificates/` | 10 MB |
| Certificate Template | Background image | `uploads/templates/` | 5 MB |
| Institution Logo | Branding | `uploads/logos/` | 2 MB |
| Signature Image | Digital signature | `uploads/signatures/` | 1 MB |
| QR Code | Verification QR | `uploads/qr/` | 500 KB |
| Uploaded Certificate | Verification upload | `uploads/temp/` | 10 MB |
| User Avatar | Profile photo | `uploads/avatars/` | 2 MB |

### 12.2 File Upload Validation

```typescript
const FILE_UPLOAD_RULES = {
  certificatePDF: {
    mimeTypes: ['application/pdf'],
    maxSize: 10 * 1024 * 1024, // 10 MB
    extensions: ['.pdf'],
  },
  templateImage: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5 MB
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  logo: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    maxSize: 2 * 1024 * 1024, // 2 MB
    extensions: ['.jpg', '.jpeg', '.png', '.svg'],
  },
  bulkImport: {
    mimeTypes: [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    maxSize: 5 * 1024 * 1024, // 5 MB
    extensions: ['.csv', '.xls', '.xlsx'],
  },
};
```

### 12.3 File Service

```typescript
class FileService {
  async uploadFile(file: Express.Multer.File, type: string): Promise<string> {
    // Validate file type
    // Validate file size
    // Generate unique filename
    // Store file
    // Return file path
  }
  
  async deleteFile(filePath: string): Promise<void> {
    // Delete file from storage
  }
  
  async getFile(filePath: string): Promise<Buffer> {
    // Retrieve file
  }
}
```

### 12.4 File Storage Strategy

**MVP:** Local filesystem
```
uploads/
├── certificates/
│   └── CERT-2026-001245.pdf
├── templates/
│   └── degree-template-bg.png
└── logos/
    └── institution-123-logo.png
```

**Production:** Cloud storage (S3, Google Cloud Storage, Azure Blob)
```typescript
// Abstract interface for future cloud migration
interface IFileStorage {
  upload(file: Buffer, key: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
```

### 12.5 File Access Control

| File Type | Access Control |
|-----------|---------------|
| Certificate PDF | Issuer (own institution), Holder (own), Admin |
| Template | Issuer (own institution), Admin |
| Logo | Issuer (own institution), Admin |
| QR Code | Public (for verification) |

### 12.6 File Cleanup

**Temporary Files:**
- Delete uploaded verification files after 24 hours
- Clean up failed certificate generation attempts

**Revoked Certificates:**
- Keep PDF for audit trail
- Mark as revoked in database

---

## 13. Fraud / Risk Architecture

### 13.1 Fraud Detection Signals

| Signal | Type | Severity | Detection Method | Status |
|--------|------|----------|------------------|--------|
| Certificate Not Found | Database | High | Database lookup | MVP |
| Hash Mismatch | Cryptographic | High | SHA-256 comparison | MVP |
| Blockchain Mismatch | Blockchain | High | Chain query | Future |
| QR Invalid | Validation | Medium | Token lookup | MVP |
| OCR Mismatch | AI | Medium | Text extraction | Future |
| Image Manipulation | AI | Medium | Forensics analysis | Future |
| Signature Anomaly | AI | Medium | Visual comparison | Future |
| Duplicate Detection | Database | Medium | Hash/metadata search | Future |
| Unusual Issuer | Pattern | Low | Behavior analysis | Future |

### 13.2 Risk Score Calculation (MVP)

```typescript
function calculateRiskScore(checks: VerificationCheck[]): number {
  let risk = 0;
  
  // Certificate not found
  if (!checks.find(c => c.label === 'Certificate Found')?.status === 'pass') {
    risk += 100; // Automatic high risk
  }
  
  // Hash mismatch
  if (checks.find(c => c.label === 'Document Integrity')?.status === 'fail') {
    risk += 60;
  }
  
  // Revoked
  if (checks.find(c => c.label === 'Revocation Check')?.status === 'fail') {
    risk += 80;
  }
  
  // QR invalid
  if (checks.find(c => c.label === 'QR Code Valid')?.status === 'fail') {
    risk += 30;
  }
  
  // Blockchain mismatch (future)
  if (checks.find(c => c.label === 'Blockchain Proof')?.status === 'fail') {
    risk += 40;
  }
  
  return Math.min(100, risk);
}
```

### 13.3 Fraud Alert System

```typescript
interface FraudAlert {
  id: string;
  certificateId: string;
  verificationId: string;
  riskScore: number;
  status: 'investigation' | 'resolved' | 'false_positive';
  flags: Array<{
    type: string;
    level: 'critical' | 'warn';
    description: string;
  }>;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string;
}
```

**Fraud Alert Creation:**
- Automatically created when risk score >= 40
- Status = 'investigation'
- Issuer notified via dashboard

### 13.4 AI Service Interface (Future)

```typescript
interface AIService {
  /**
   * Analyze uploaded certificate for fraud signals
   */
  analyzeCertificate(file: Buffer): Promise<AIAnalysisResult>;
  
  /**
   * Extract text via OCR
   */
  extractText(file: Buffer): Promise<string>;
  
  /**
   * Detect image manipulation
   */
  detectManipulation(file: Buffer): Promise<{
    manipulated: boolean;
    confidence: number;
    regions: Array<{ x: number; y: number; width: number; height: number }>;
  }>;
  
  /**
   * Compare signatures
   */
  compareSignatures(signature1: Buffer, signature2: Buffer): Promise<{
    match: boolean;
    confidence: number;
  }>;
}

// Mock implementation for MVP
class MockAIService implements AIService {
  async analyzeCertificate(): Promise<AIAnalysisResult> {
    return {
      riskScore: 5,
      signals: [],
    };
  }
  
  async extractText(): Promise<string> {
    throw new Error('OCR not implemented');
  }
  
  async detectManipulation(): Promise<any> {
    return { manipulated: false, confidence: 0 };
  }
  
  async compareSignatures(): Promise<any> {
    return { match: true, confidence: 0 };
  }
}
```

---

## 14. Reports

### 14.1 Verification Report

**Generate detailed verification report for a certificate verification.**

```typescript
interface VerificationReport {
  reportId: string;
  certificateId: string;
  verificationId: string;
  
  generatedAt: Date;
  generatedBy?: string;
  
  certificate: {
    id: string;
    type: string;
    holderName: string;
    institution: string;
    issueDate: string;
  };
  
  verificationResult: {
    status: 'verified' | 'review' | 'failed';
    trustScore: number;
    verifiedAt: string;
  };
  
  checks: Array<{
    label: string;
    status: 'pass' | 'fail' | 'warn';
    detail: string;
  }>;
  
  blockchainProof?: {
    network: string;
    transactionId: string;
    timestamp: string;
  };
  
  fraudSignals?: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
  
  reportUrl: string; // PDF download URL
}
```

**GET /api/verifier/reports/:verificationId**
- Generate PDF report
- Include QR code, certificate details, verification result
- Store report for future access

### 14.2 Certificate Report (Issuer)

**Certificate issuance summary report**

```typescript
interface CertificateReport {
  institutionId: string;
  institutionName: string;
  
  reportPeriod: {
    from: Date;
    to: Date;
  };
  
  summary: {
    totalIssued: number;
    totalVerified: number;
    totalRevoked: number;
    totalSuspicious: number;
  };
  
  byType: Array<{
    type: string;
    count: number;
  }>;
  
  topVerifiers: Array<{
    organization: string;
    count: number;
  }>;
  
  certificates: Certificate[];
}
```

**GET /api/issuer/reports/certificates**
- Query params: `?from=2026-01-01&to=2026-12-31`
- Export as PDF or CSV

### 14.3 Audit Report

**GET /api/issuer/audit-logs/export**
- Export audit logs as CSV
- Columns: Timestamp, User, Action, IP, Device, Result

---

## 15. Analytics

### 15.1 Issuer Analytics

**GET /api/issuer/analytics**

```typescript
Response: {
  success: true;
  data: {
    overview: {
      totalCertificates: number;
      issuedThisMonth: number;
      verifiedThisMonth: number;
      revokedTotal: number;
      suspiciousTotal: number;
    };
    
    issuanceTrend: Array<{
      date: string;
      count: number;
    }>;
    
    verificationTrend: Array<{
      date: string;
      successful: number;
      failed: number;
      suspicious: number;
    }>;
    
    certificateTypes: Array<{
      type: string;
      count: number;
    }>;
    
    fraudDetection: Array<{
      date: string;
      high: number;
      medium: number;
      low: number;
    }>;
    
    revocationsByReason: Array<{
      reason: string;
      count: number;
    }>;
    
    blockchainStats: {
      totalTransactions: number;
      successRate: string;
      avgConfirmTime: string;
    };
  }
}
```

### 15.2 Admin Analytics

**GET /api/admin/dashboard**

```typescript
Response: {
  success: true;
  data: {
    overview: {
      totalInstitutions: number;
      totalCertificates: number;
      totalVerifications: number;
      activeUsers: number;
      pendingReviews: number;
    };
    
    institutionEngagement: Array<{
      institutionName: string;
      certificateCount: number;
      verificationCount: number;
    }>;
    
    operationalHealth: {
      databaseUptime: string;
      apiResponseTime: string;
      verificationJobSuccess: string;
      authSuccessRate: string;
    };
    
    recentActivity: Array<{
      action: string;
      description: string;
      timestamp: string;
    }>;
    
    priorityAlerts: Array<{
      title: string;
      detail: string;
      severity: 'high' | 'medium' | 'low';
      timestamp: string;
    }>;
  }
}
```

### 15.3 Verifier Analytics

**GET /api/verifier/stats**

```typescript
Response: {
  success: true;
  data: {
    totalVerifications: number;
    verified: number;
    review: number;
    failed: number;
    
    activityTrend: Array<{
      date: string;
      count: number;
    }>;
  }
}
```

---

## 16. Audit Logs

### 16.1 Audit Events

| Event | Description | User Role | Data Logged |
|-------|-------------|-----------|-------------|
| `user.login` | User login | All | Email, IP, device |
| `user.logout` | User logout | All | Email, IP |
| `user.register` | New user registration | All | Email, role |
| `user.password_change` | Password change | All | Email |
| `certificate.issue` | Certificate issued | Issuer | Certificate ID, student |
| `certificate.revoke` | Certificate revoked | Issuer, Admin | Certificate ID, reason |
| `certificate.view` | Certificate viewed | All | Certificate ID, user |
| `certificate.download` | Certificate downloaded | Issuer, Holder | Certificate ID |
| `verification.perform` | Verification performed | Verifier | Certificate ID, result |
| `template.create` | Template created | Issuer | Template ID |
| `template.update` | Template updated | Issuer | Template ID |
| `template.delete` | Template deleted | Issuer | Template ID |
| `student.create` | Student added | Issuer | Student ID |
| `student.update` | Student updated | Issuer | Student ID |
| `student.delete` | Student deleted | Issuer | Student ID |
| `institution.update` | Institution updated | Issuer, Admin | Institution ID |
| `user.invite` | User invited | Issuer, Admin | Email, role |
| `user.role_change` | User role changed | Issuer, Admin | User ID, old role, new role |
| `user.delete` | User deleted | Issuer, Admin | User ID |
| `settings.update` | Settings updated | Issuer, Admin | Setting key |

### 16.2 Audit Log Schema

```typescript
interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  
  event: string; // e.g., 'certificate.issue'
  action: string; // Human-readable description
  
  entityType?: string; // e.g., 'certificate'
  entityId?: string;
  
  ipAddress: string;
  userAgent: string;
  
  metadata?: Record<string, any>;
  
  result: 'success' | 'failure';
  errorMessage?: string;
  
  createdAt: Date;
}
```

### 16.3 Audit Logging Service

```typescript
class AuditService {
  async log(params: {
    userId?: string;
    event: string;
    action: string;
    entityType?: string;
    entityId?: string;
    ipAddress: string;
    userAgent: string;
    metadata?: Record<string, any>;
    result: 'success' | 'failure';
    errorMessage?: string;
  }): Promise<void> {
    // Create audit log entry
  }
}

// Usage
await auditService.log({
  userId: req.user.id,
  event: 'certificate.issue',
  action: `Issued certificate ${certificate.certificateNumber} to ${student.name}`,
  entityType: 'certificate',
  entityId: certificate.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  metadata: { studentId: student.id },
  result: 'success',
});
```

### 16.4 Audit Log Retention

- **Retention Period:** 7 years (compliance requirement)
- **Storage:** Separate audit database or table
- **Immutability:** Audit logs cannot be edited or deleted
- **Export:** Administrators can export logs as CSV

---

## 17. Security

### 17.1 Security Checklist

✅ **Authentication & Authorization**
- [ ] JWT-based authentication
- [ ] Password hashing with bcrypt
- [ ] Role-based access control
- [ ] Session management
- [ ] Password reset with secure tokens

✅ **Input Validation**
- [ ] Zod schema validation on all inputs
- [ ] SQL injection prevention (Drizzle ORM parameterized queries)
- [ ] XSS prevention (sanitize outputs)
- [ ] File upload validation (MIME type, size, extension)
- [ ] Request size limits

✅ **API Security**
- [ ] Helmet.js for security headers
- [ ] CORS configuration
- [ ] Rate limiting (express-rate-limit)
- [ ] Request logging
- [ ] Error handling (no sensitive data in errors)

✅ **Data Protection**
- [ ] HTTPS only (production)
- [ ] Encrypted database connections
- [ ] Secure file storage
- [ ] Sensitive data encryption at rest (future)
- [ ] PII handling compliance

✅ **File Security**
- [ ] File upload validation
- [ ] Path traversal prevention
- [ ] Virus scanning (future)
- [ ] Secure file serving

✅ **Logging & Monitoring**
- [ ] Audit logs for all critical actions
- [ ] Error logging (without sensitive data)
- [ ] Failed login attempt tracking
- [ ] Anomaly detection (future)

### 17.2 Security Middleware Stack

```typescript
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
app.use('/api/auth/login', authLimiter);

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload limits
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
  },
});
```

### 17.3 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/certifyvault

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email (future)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Blockchain (future)
BLOCKCHAIN_NETWORK=polygon
BLOCKCHAIN_API_KEY=

# AI Service (future)
AI_SERVICE_URL=http://localhost:8000
```

### 17.4 Secure Coding Practices

**Password Hashing:**
```typescript
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

**JWT Generation:**
```typescript
import jwt from 'jsonwebtoken';

function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
```

**SQL Injection Prevention:**
```typescript
// Drizzle ORM automatically uses parameterized queries
const user = await db.query.users.findFirst({
  where: eq(users.email, email), // Safe - parameterized
});

// NEVER do this:
// const user = await db.execute(`SELECT * FROM users WHERE email = '${email}'`);
```

**XSS Prevention:**
```typescript
// Frontend: React automatically escapes content
// Backend: Don't send raw HTML, use JSON

// If HTML is needed, sanitize it
import sanitizeHtml from 'sanitize-html';
const clean = sanitizeHtml(dirty);
```

---

## 18. API Error Standard

### 18.1 Standard Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### 18.2 Error Codes

| HTTP Status | Error Code | Message | Use Case |
|-------------|------------|---------|----------|
| 400 | `INVALID_INPUT` | Invalid input data | Validation failure |
| 400 | `MISSING_REQUIRED_FIELD` | Required field missing | Missing parameter |
| 401 | `UNAUTHORIZED` | Authentication required | No JWT token |
| 401 | `INVALID_TOKEN` | Invalid or expired token | JWT validation failure |
| 401 | `INVALID_CREDENTIALS` | Invalid email or password | Login failure |
| 403 | `FORBIDDEN` | Insufficient permissions | Role authorization failure |
| 403 | `INSTITUTION_MISMATCH` | Resource belongs to another institution | Ownership check failure |
| 404 | `NOT_FOUND` | Resource not found | Entity doesn't exist |
| 404 | `CERTIFICATE_NOT_FOUND` | Certificate not found | Certificate lookup failure |
| 404 | `USER_NOT_FOUND` | User not found | User lookup failure |
| 409 | `DUPLICATE_ENTRY` | Resource already exists | Unique constraint violation |
| 409 | `EMAIL_ALREADY_EXISTS` | Email already registered | Duplicate email |
| 409 | `CERTIFICATE_ALREADY_REVOKED` | Certificate already revoked | Revocation attempt on revoked cert |
| 413 | `FILE_TOO_LARGE` | File size exceeds limit | File upload size exceeded |
| 415 | `UNSUPPORTED_FILE_TYPE` | Unsupported file type | Invalid MIME type |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests | Rate limit hit |
| 500 | `INTERNAL_SERVER_ERROR` | Internal server error | Unexpected error |
| 500 | `DATABASE_ERROR` | Database operation failed | DB error |
| 500 | `FILE_OPERATION_FAILED` | File operation failed | File I/O error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable | External service down |

### 18.3 Error Handler Middleware

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', err);
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

### 18.4 Success Response Format

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

---

## 19. API Documentation

### 19.1 Documentation Approach

**Tool:** Swagger / OpenAPI 3.0

**Installation:**
```bash
npm install swagger-jsdoc swagger-ui-express @types/swagger-jsdoc @types/swagger-ui-express
```

**Configuration:**
```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CertifyVault API',
      version: '1.0.0',
      description: 'API documentation for CertifyVault backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### 19.2 Example API Documentation

```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);
```

---

## 20. Testing Strategy

### 20.1 Test Pyramid

```
       ┌─────────────┐
       │  E2E Tests  │  (10%)
       └─────────────┘
     ┌───────────────────┐
     │ Integration Tests │  (30%)
     └───────────────────┘
   ┌───────────────────────┐
   │     Unit Tests        │  (60%)
   └───────────────────────┘
```

### 20.2 Testing Tools

**Framework:** Jest + Supertest

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

**Configuration: `jest.config.js`**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 20.3 Unit Tests

**Example: Hash Service**
```typescript
// tests/unit/hash.service.test.ts
import { HashService } from '../../src/services/hash.service';

describe('HashService', () => {
  let hashService: HashService;
  
  beforeEach(() => {
    hashService = new HashService();
  });
  
  describe('computeSHA256', () => {
    it('should generate consistent hash for same input', async () => {
      const data = Buffer.from('test data');
      const hash1 = await hashService.computeSHA256(data);
      const hash2 = await hashService.computeSHA256(data);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 = 64 hex characters
    });
    
    it('should generate different hash for different input', async () => {
      const data1 = Buffer.from('test data 1');
      const data2 = Buffer.from('test data 2');
      
      const hash1 = await hashService.computeSHA256(data1);
      const hash2 = await hashService.computeSHA256(data2);
      
      expect(hash1).not.toBe(hash2);
    });
  });
});
```

### 20.4 Integration Tests

**Example: Certificate API**
```typescript
// tests/integration/certificate.test.ts
import request from 'supertest';
import app from '../../src/app';
import { db } from '../../src/db';

describe('POST /api/issuer/certificates/issue', () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Setup test database
    // Create test user and get JWT
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = loginRes.body.data.accessToken;
  });
  
  afterAll(async () => {
    // Cleanup test database
  });
  
  it('should issue a certificate successfully', async () => {
    const response = await request(app)
      .post('/api/issuer/certificates/issue')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        studentId: 'test-student-id',
        certificateType: 'degree',
        title: 'Bachelor of Science',
        program: 'Computer Science',
        issueDate: '2026-06-15',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.certificate).toHaveProperty('id');
    expect(response.body.data.certificate).toHaveProperty('sha256Hash');
    expect(response.body.data.certificate).toHaveProperty('qrToken');
  });
  
  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .post('/api/issuer/certificates/issue')
      .send({
        studentId: 'test-student-id',
        certificateType: 'degree',
        title: 'Bachelor of Science',
        program: 'Computer Science',
        issueDate: '2026-06-15',
      });
    
    expect(response.status).toBe(401);
  });
});
```

### 20.5 Test Database

**Approach:** Separate test database

```env
# .env.test
DATABASE_URL=postgresql://user:password@localhost:5432/certifyvault_test
```

**Setup:**
```typescript
// tests/setup.ts
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../src/db';

beforeAll(async () => {
  // Run migrations
  await migrate(db, { migrationsFolder: './src/db/migrations' });
});

afterAll(async () => {
  // Drop all tables
  await db.execute('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
});
```

### 20.6 Test Coverage Goals

| Component | Coverage Target |
|-----------|----------------|
| Services | 80%+ |
| Controllers | 70%+ |
| Repositories | 70%+ |
| Middleware | 80%+ |
| Validators | 90%+ |
| Utils | 80%+ |
| **Overall** | **70%+** |

---

## 21. Development Phases

### Phase 0: Frontend Analysis + Backend Planning ✅ CURRENT PHASE
- [x] Analyze frontend requirements
- [x] Create backend.md
- [ ] Create schema.md
- [ ] Team review and alignment

### Phase 1: Core Backend Foundation (Week 1)
**Owner: P1**
- [ ] Initialize Express backend structure
- [ ] Setup TypeScript configuration
- [ ] Setup Drizzle ORM connection
- [ ] Database schema design
- [ ] Run initial migrations
- [ ] Setup environment configuration
- [ ] Setup logging
- [ ] Setup error handling middleware
- [ ] Setup security middleware (Helmet, CORS, rate limiting)

### Phase 2: Authentication + Authorization (Week 1-2)
**Owner: P1**
- [ ] User registration API
- [ ] Login API
- [ ] JWT generation and validation
- [ ] Authentication middleware
- [ ] Role-based authorization middleware
- [ ] Password reset flow
- [ ] Session management

### Phase 3: Institution / Issuer / Student Management (Week 2)
**Owner: P3**
- [ ] Institution CRUD APIs
- [ ] Student CRUD APIs
- [ ] Student import (CSV/Excel)
- [ ] Institution settings APIs
- [ ] User management (invite, role change, delete)

### Phase 4: Certificate Management (Week 2-3)
**Owner: P1**
- [ ] Certificate schema
- [ ] Certificate CRUD APIs
- [ ] Certificate listing with filters
- [ ] Certificate details API

### Phase 5: Certificate Issuance + PDF/File Handling (Week 3-4)
**Owner: P1 + P2**
- P1: Certificate issuance logic
- P2: PDF generation, file storage, QR generation
- [ ] Single certificate issuance
- [ ] Bulk certificate issuance
- [ ] PDF generation service
- [ ] QR code generation service
- [ ] SHA-256 hashing service
- [ ] File upload/download APIs
- [ ] Certificate download API

### Phase 6: QR Verification (Week 4)
**Owner: P2**
- [ ] QR token generation and storage
- [ ] QR verification endpoint
- [ ] QR token validation

### Phase 7: Certificate Verification Workflow (Week 4-5)
**Owner: P2**
- [ ] Public verification API
- [ ] Verification by QR
- [ ] Verification by ID
- [ ] Verification by file upload
- [ ] Trust score calculation
- [ ] Verification record storage
- [ ] Verification history APIs

### Phase 8: Fraud / Risk Analysis Integration (Week 5)
**Owner: P2**
- [ ] Fraud alert system
- [ ] Risk score calculation
- [ ] Fraud alert APIs
- [ ] Mock AI service interface
- [ ] Future blockchain service interface

### Phase 9: Reports + Analytics (Week 5-6)
**Owner: P4**
- [ ] Issuer analytics API
- [ ] Admin analytics API
- [ ] Verifier analytics API
- [ ] Verification report generation
- [ ] Certificate report generation

### Phase 10: Revocation / Audit / Notifications (Week 6)
**Owner: P4**
- [ ] Certificate revocation API
- [ ] Revocation history APIs
- [ ] Audit logging service
- [ ] Audit log APIs
- [ ] Audit log export

### Phase 11: Testing + Security + Integration (Week 7)
**All Team Members**
- [ ] Unit tests (P1, P2, P3, P4)
- [ ] Integration tests (P1, P2)
- [ ] E2E tests (P1, P2)
- [ ] Security audit (P1)
- [ ] Performance testing (P2)
- [ ] Frontend-backend integration (All)
- [ ] Bug fixes and optimization (All)

---

## 22. Team Task Board

### P1 — Core Backend & Authentication

#### Phase 1
⬜ **Task P1.1** — Initialize Express backend  
⬜ **Task P1.2** — PostgreSQL + Drizzle connection  
⬜ **Task P1.3** — Environment configuration  
⬜ **Task P1.4** — Global error handling  
⬜ **Task P1.5** — Security middleware setup

#### Phase 2
⬜ **Task P1.6** — Authentication service  
⬜ **Task P1.7** — JWT middleware  
⬜ **Task P1.8** — Role-based authorization  
⬜ **Task P1.9** — Password reset flow

#### Phase 4-5
⬜ **Task P1.10** — Certificate core service  
⬜ **Task P1.11** — Certificate issuance logic  
⬜ **Task P1.12** — Single certificate issuance API  
⬜ **Task P1.13** — Bulk issuance coordinator

### P2 — Verification + Files + QR + Complex Integrations

#### Phase 5
⬜ **Task P2.1** — File service architecture  
⬜ **Task P2.2** — PDF generation service  
⬜ **Task P2.3** — QR service implementation  
⬜ **Task P2.4** — SHA-256 hashing service  
⬜ **Task P2.5** — File upload APIs

#### Phase 6-7
⬜ **Task P2.6** — QR verification endpoint  
⬜ **Task P2.7** — Public verification API  
⬜ **Task P2.8** — Verification workflow engine  
⬜ **Task P2.9** — Trust score calculation  
⬜ **Task P2.10** — Verification history APIs

#### Phase 8
⬜ **Task P2.11** — Fraud detection architecture  
⬜ **Task P2.12** — Risk score algorithm  
⬜ **Task P2.13** — Mock AI service interface  
⬜ **Task P2.14** — Mock blockchain service interface

### P3 — Institution / Issuer / Student Management + Admin APIs

#### Phase 3
⬜ **Task P3.1** — Institution repository  
⬜ **Task P3.2** — Institution CRUD APIs  
⬜ **Task P3.3** — Student repository  
⬜ **Task P3.4** — Student CRUD APIs  
⬜ **Task P3.5** — Student CSV import  
⬜ **Task P3.6** — User management APIs  
⬜ **Task P3.7** — Institution settings APIs

#### Additional
⬜ **Task P3.8** — Admin institution management  
⬜ **Task P3.9** — Admin user management  
⬜ **Task P3.10** — Template CRUD APIs

### P4 — Analytics + Audit Logs + Notifications + Testing Support

#### Phase 9
⬜ **Task P4.1** — Analytics service architecture  
⬜ **Task P4.2** — Issuer analytics API  
⬜ **Task P4.3** — Admin analytics API  
⬜ **Task P4.4** — Verifier analytics API  
⬜ **Task P4.5** — Report generation service

#### Phase 10
⬜ **Task P4.6** — Audit logging service  
⬜ **Task P4.7** — Audit log APIs  
⬜ **Task P4.8** — Audit log export  
⬜ **Task P4.9** — Certificate revocation APIs

#### Phase 11
⬜ **Task P4.10** — Test infrastructure setup  
⬜ **Task P4.11** — Unit test suite  
⬜ **Task P4.12** — Integration test helpers

---

## 23. Dependency Graph

```
WAVE 1 (Week 1)
├── P1: Backend Foundation ──→ All subsequent tasks
└── P1: Authentication ──→ All protected APIs

WAVE 2 (Week 2)
├── P3: Institution Management ──→ P1: Certificate Management
├── P3: Student Management ──→ P1: Certificate Issuance
└── P4: Test Infrastructure ──→ All testing tasks

WAVE 3 (Week 2-3)
├── P1: Certificate Core ──→ P1: Certificate Issuance
└── P3: User Management ──→ Admin features

WAVE 4 (Week 3-4)
├── P1: Certificate Issuance ──→ P2: File/PDF/QR Services
├── P2: PDF Generation ──→ P2: QR Generation
└── P2: File Service ──→ P2: Certificate Download

WAVE 5 (Week 4-5)
├── P2: QR Verification ──→ P2: Verification Workflow
└── P2: Verification Workflow ──→ P2: Fraud Detection

WAVE 6 (Week 5-6)
├── P2: Fraud Detection ──→ P4: Analytics
├── P4: Analytics ──→ P4: Reports
└── P4: Audit Service ──→ P4: Audit APIs

WAVE 7 (Week 6-7)
└── All: Testing & Integration
```

---

## 24. Parallel Development Plan

### Week 1
| P1 | P2 | P3 | P4 |
|----|----|----|-----|
| Backend foundation | Review architecture | Review architecture | Test infrastructure |
| Authentication | Help with DB schema | Help with DB schema | Test utilities |

### Week 2
| P1 | P2 | P3 | P4 |
|----|----|----|-----|
| Authorization | File service design | Institution APIs | Analytics design |
| Certificate schema | PDF research | Student APIs | Report design |

### Week 3
| P1 | P2 | P3 | P4 |
|----|----|----|-----|
| Certificate issuance | PDF generation | User management | Audit service |
| Bulk issuance | QR generation | Template APIs | Audit APIs |

### Week 4
| P1 | P2 | P3 | P4 |
|----|----|----|-----|
| Certificate APIs | QR verification | Admin APIs | Analytics implementation |
| Download APIs | Verification workflow | Settings APIs | Report generation |

### Week 5
| P1 | P2 | P3 | P4 |
|----|----|----|-----|
| Integration support | Fraud detection | Integration testing | Analytics APIs |
| Bug fixes | Verification APIs | Bug fixes | Revocation APIs |

### Week 6-7
| P1 | P2 | P3 | P4 |
|----|----|----|-----|
| Testing | Testing | Testing | Testing |
| Security audit | Integration testing | Integration testing | Audit export |
| Documentation | Documentation | Documentation | Documentation |

---

## 25. Git / Branch Strategy

### 25.1 Branch Structure

```
main
  └── develop
      ├── feature/p1-auth
      ├── feature/p1-certificates
      ├── feature/p2-verification
      ├── feature/p2-files
      ├── feature/p3-institution
      ├── feature/p3-students
      ├── feature/p4-analytics
      └── feature/p4-audit
```

### 25.2 Branch Naming Convention

**Format:** `feature/<owner>-<feature-name>`

Examples:
- `feature/p1-authentication`
- `feature/p2-pdf-generation`
- `feature/p3-student-management`
- `feature/p4-analytics`

### 25.3 Commit Message Convention

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): implement JWT authentication
fix(cert): resolve hash mismatch issue
refactor(verification): optimize trust score calculation
test(auth): add login endpoint tests
docs(api): update API documentation
chore(deps): update dependencies
```

### 25.4 Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/p1-authentication
   ```

2. **Develop and Commit**
   ```bash
   git add .
   git commit -m "feat(auth): implement user registration"
   ```

3. **Push to Remote**
   ```bash
   git push -u origin feature/p1-authentication
   ```

4. **Create Pull Request**
   - Base: `develop`
   - Compare: `feature/p1-authentication`
   - Title: `[P1] Authentication System`
   - Description: List changes, testing done, dependencies

5. **Code Review**
   - At least 1 approval required
   - All tests must pass
   - No merge conflicts

6. **Merge to Develop**
   - Use "Squash and merge" for cleaner history
   - Delete feature branch after merge

7. **Deploy to Develop**
   - `develop` branch auto-deploys to dev environment (future)

8. **Merge to Main**
   - After testing on develop
   - Create release PR: `develop` → `main`
   - Tag release: `v1.0.0`

### 25.5 File Ownership Rules

| Files | Owner | Others Can Modify? |
|-------|-------|-------------------|
| `src/services/auth.service.ts` | P1 | No (coordinate first) |
| `src/services/certificate.service.ts` | P1 | No (coordinate first) |
| `src/services/verification.service.ts` | P2 | No (coordinate first) |
| `src/services/file.service.ts` | P2 | No (coordinate first) |
| `src/services/institution.service.ts` | P3 | No (coordinate first) |
| `src/services/student.service.ts` | P3 | No (coordinate first) |
| `src/services/analytics.service.ts` | P4 | No (coordinate first) |
| `src/services/audit.service.ts` | P4 | No (coordinate first) |
| `src/types/*` | Shared | Yes (with review) |
| `src/utils/*` | Shared | Yes (with review) |
| `src/db/schema.ts` | P1 | Yes (with coordination) |

### 25.6 Conflict Resolution

**If conflicts arise:**
1. Communicate in team chat
2. File owner has final say on their files
3. Merge conflicts resolved by PR author
4. If major conflict, schedule sync meeting

---

**END OF BACKEND.MD**

---

## Next Steps

1. **Review this document** with the entire team
2. **Create schema.md** (database design)
3. **Set up development environment**
4. **Begin Phase 1** (Backend Foundation)
5. **Daily standups** to track progress
6. **Weekly demos** to review completed features

---

**Document Metadata:**
- Created: September 26, 2026
- Version: 1.0
- Authors: Lead Backend Architect
- Next Review: After Phase 1 completion
