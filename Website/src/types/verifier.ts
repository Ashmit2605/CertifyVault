// ─── Verification Types ───────────────────────────────────────────────────────

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
  label: 'Excellent' | 'Good' | 'Moderate' | 'High Risk' | 'Critical'
  color: string
}

export interface BlockchainProof {
  network: string
  certificateHash: string
  transactionId: string
  anchoredAt: string
  explorerUrl?: string
}

export interface Certificate {
  id: string
  type: string
  holderName: string
  degree: string
  institution: string
  issuedDate: string
  expiryDate?: string
  issuerLogo?: string
}

export interface FraudSignal {
  type: 'image_manipulation' | 'metadata_anomaly' | 'font_inconsistency' | 'signature_anomaly' | 'hash_mismatch'
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
