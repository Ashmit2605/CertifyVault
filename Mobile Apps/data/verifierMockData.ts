export type VerificationStatus = 'verified' | 'review' | 'failed' | 'pending'
export type VerificationMethod = 'qr' | 'upload' | 'id'

export interface VerificationCheck {
  id: string
  label: string
  status: 'pass' | 'fail' | 'warn' | 'pending'
  detail?: string
}

export interface TrustScore {
  score: number
  label: string
  color: string
}

export interface BlockchainProof {
  network: string
  certificateHash: string
  transactionId: string
  anchoredAt: string
}

export interface Certificate {
  id: string
  type: string
  holderName: string
  degree: string
  institution: string
  issuedDate: string
}

export interface FraudSignal {
  type: string
  severity: 'low' | 'medium' | 'high'
  description: string
}

export interface VerificationResult {
  id: string
  status: VerificationStatus
  trustScore: TrustScore
  certificate: Certificate
  checks: VerificationCheck[]
  blockchainProof: BlockchainProof
  fraudSignals: FraudSignal[]
  verifiedAt: string
  method: VerificationMethod
}

export interface VerificationHistoryItem {
  id: string
  certificateId: string
  certificateType: string
  holderName: string
  institution: string
  status: VerificationStatus
  trustScore: number
  verifiedAt: string
  method: VerificationMethod
}

export interface VerifierStats {
  total: number
  verified: number
  review: number
  failed: number
}

export const MOCK_VERIFIED_RESULT: VerificationResult = {
  id: 'vr-001',
  status: 'verified',
  trustScore: { score: 96, label: 'Excellent', color: '#16A34A' },
  certificate: {
    id: 'CV-2026-001245',
    type: 'Degree Certificate',
    holderName: 'Arjun Mehta',
    degree: 'Bachelor of Technology — Computer Engineering',
    institution: 'ABC University',
    issuedDate: '15 June 2026',
  },
  checks: [
    { id: 'c1', label: 'Certificate Found',       status: 'pass', detail: 'Record located in issuer database' },
    { id: 'c2', label: 'Issuer Verified',          status: 'pass', detail: 'ABC University — authorized issuer' },
    { id: 'c3', label: 'QR Code Valid',            status: 'pass', detail: 'QR payload matches certificate record' },
    { id: 'c4', label: 'OCR Data Matched',         status: 'pass', detail: 'Extracted text matches stored record' },
    { id: 'c5', label: 'Document Integrity',       status: 'pass', detail: 'SHA-256 hash verified' },
    { id: 'c6', label: 'Blockchain Proof',         status: 'pass', detail: 'On-chain anchor confirmed' },
    { id: 'c7', label: 'Fraud Analysis',           status: 'pass', detail: 'No manipulation signals detected' },
  ],
  blockchainProof: {
    network: 'Polygon',
    certificateHash: '8f31a9c8d4e2b7f1a3c9e5d8b2f4a6c0e1d3b5f7',
    transactionId: '0x73af9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    anchoredAt: '12 Aug 2026',
  },
  fraudSignals: [],
  verifiedAt: new Date().toISOString(),
  method: 'upload',
}

export const MOCK_SUSPICIOUS_RESULT: VerificationResult = {
  id: 'vr-002',
  status: 'review',
  trustScore: { score: 23, label: 'High Risk', color: '#DC2626' },
  certificate: {
    id: 'CV-2025-009871',
    type: 'Diploma Certificate',
    holderName: 'Unknown',
    degree: 'Diploma in Business Administration',
    institution: 'XYZ College',
    issuedDate: '10 March 2025',
  },
  checks: [
    { id: 'c1', label: 'Certificate Found',       status: 'pass', detail: 'Record located in database' },
    { id: 'c2', label: 'Issuer Verified',          status: 'pass', detail: 'XYZ College — authorized issuer' },
    { id: 'c3', label: 'QR Code Valid',            status: 'pass', detail: 'QR payload decoded' },
    { id: 'c4', label: 'OCR Data Matched',         status: 'fail', detail: 'Certificate number mismatch detected' },
    { id: 'c5', label: 'Document Integrity',       status: 'fail', detail: 'SHA-256 hash does not match stored record' },
    { id: 'c6', label: 'Blockchain Proof',         status: 'fail', detail: 'On-chain hash mismatch' },
    { id: 'c7', label: 'Fraud Analysis',           status: 'warn', detail: 'Possible image manipulation detected' },
  ],
  blockchainProof: {
    network: 'Polygon',
    certificateHash: 'MISMATCH — stored: 8f31a9c8...92ab',
    transactionId: '0x73af...91cd',
    anchoredAt: '10 Mar 2025',
  },
  fraudSignals: [
    { type: 'hash_mismatch',      severity: 'high',   description: 'Document hash does not match blockchain record' },
    { type: 'image_manipulation', severity: 'medium', description: 'Possible pixel-level manipulation in text region' },
    { type: 'signature_anomaly',  severity: 'medium', description: 'Signature region shows inconsistency' },
  ],
  verifiedAt: new Date().toISOString(),
  method: 'upload',
}

export const MOCK_HISTORY: VerificationHistoryItem[] = [
  { id: 'h1', certificateId: 'CV-2026-001245', certificateType: 'B.Tech Certificate',     holderName: 'Arjun Mehta',  institution: 'ABC University',   status: 'verified', trustScore: 96, verifiedAt: '2 min ago',   method: 'upload' },
  { id: 'h2', certificateId: 'CV-2026-001198', certificateType: 'Internship Certificate', holderName: 'Priya Sharma', institution: 'TechCorp Ltd',     status: 'verified', trustScore: 91, verifiedAt: '18 min ago',  method: 'qr'     },
  { id: 'h3', certificateId: 'CV-2025-009871', certificateType: 'Diploma Certificate',    holderName: 'Unknown',      institution: 'XYZ College',      status: 'review',   trustScore: 23, verifiedAt: '1 hour ago',  method: 'upload' },
  { id: 'h4', certificateId: 'CV-2026-001102', certificateType: 'MBA Certificate',        holderName: 'Sarah Wilson', institution: 'Global B-School',  status: 'verified', trustScore: 88, verifiedAt: '3 hours ago', method: 'id'     },
  { id: 'h5', certificateId: 'CV-2026-001089', certificateType: 'Research Certificate',   holderName: 'Michael Chen', institution: 'IIT Research',     status: 'verified', trustScore: 94, verifiedAt: 'Yesterday',   method: 'qr'     },
  { id: 'h6', certificateId: 'CV-2025-008812', certificateType: 'Degree Certificate',     holderName: 'Riya Patel',   institution: 'State University', status: 'failed',   trustScore: 8,  verifiedAt: 'Yesterday',   method: 'upload' },
]

export const MOCK_STATS: VerifierStats = { total: 248, verified: 231, review: 11, failed: 6 }

export const MOCK_CHART_DATA = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 8  },
  { day: 'Thu', count: 24 },
  { day: 'Fri', count: 31 },
  { day: 'Sat', count: 7  },
  { day: 'Sun', count: 5  },
]

export const VERIFICATION_STEPS = [
  { id: 's1', label: 'Reading certificate'          },
  { id: 's2', label: 'Extracting information'       },
  { id: 's3', label: 'Checking issuer'              },
  { id: 's4', label: 'Validating QR code'           },
  { id: 's5', label: 'Checking document integrity'  },
  { id: 's6', label: 'Comparing certificate record' },
  { id: 's7', label: 'Checking blockchain proof'    },
  { id: 's8', label: 'Running fraud analysis'       },
  { id: 's9', label: 'Generating trust score'       },
]

export const SAVED_VERIFICATIONS = [
  { id: 's1', name: 'Arjun Mehta',  degree: 'B.Tech Computer Engineering', institution: 'ABC University',  status: 'verified' as const, score: 96 },
  { id: 's2', name: 'Sarah Wilson', degree: 'MBA',                          institution: 'Global B-School', status: 'verified' as const, score: 88 },
  { id: 's3', name: 'Michael Chen', degree: 'Diploma in Business Admin',    institution: 'XYZ College',     status: 'review'   as const, score: 23 },
  { id: 's4', name: 'Priya Sharma', degree: 'Internship Certificate',       institution: 'TechCorp Ltd',    status: 'verified' as const, score: 91 },
]

export const MOCK_REPORTS = [
  { id: 'r1', title: 'B.Tech Certificate — Arjun Mehta',      certId: 'CV-2026-001245', status: 'verified' as const, score: 96, date: '12 Aug 2026' },
  { id: 'r2', title: 'Internship Certificate — Priya Sharma', certId: 'CV-2026-001198', status: 'verified' as const, score: 91, date: '12 Aug 2026' },
  { id: 'r3', title: 'Diploma Certificate — Unknown',         certId: 'CV-2025-009871', status: 'review'   as const, score: 23, date: '11 Aug 2026' },
  { id: 'r4', title: 'MBA Certificate — Sarah Wilson',        certId: 'CV-2026-001102', status: 'verified' as const, score: 88, date: '11 Aug 2026' },
]
