export type CertificateStatus = 'Verified' | 'Revoked'

export type HolderCertificate = {
  id: string
  title: string
  issuer: string
  icon: string
  status: CertificateStatus
  issued: string
  type: string
}

export const HOLDER_CERTIFICATES: HolderCertificate[] = [
  { id: 'CV-2026-001245', title: 'B.E. Computer Engineering', issuer: 'PCCOER', icon: '🎓', status: 'Verified', issued: 'June 2026', type: 'Degree' },
  { id: 'CV-2026-000987', title: 'Internship Certificate', issuer: 'ABC Technologies', icon: '💼', status: 'Verified', issued: 'May 2026', type: 'Internship' },
  { id: 'CV-2025-004521', title: 'Data Structures & Algorithms', issuer: 'NPTEL', icon: '📘', status: 'Verified', issued: 'Dec 2025', type: 'Course' },
  { id: 'CV-2025-003310', title: 'Cloud Computing Fundamentals', issuer: 'AWS Academy', icon: '☁️', status: 'Verified', issued: 'Oct 2025', type: 'Training' },
  { id: 'CV-2025-002187', title: 'Hackathon Winner - SIH 2025', issuer: 'Smart India Hackathon', icon: '🏆', status: 'Verified', issued: 'Sep 2025', type: 'Other' },
  { id: 'CV-2024-009911', title: 'Web Development Bootcamp', issuer: 'XYZ Corp', icon: '💻', status: 'Revoked', issued: 'Jan 2024', type: 'Training' },
]

export const HOLDER_ACTIVITY = [
  { icon: 'checkmark-circle-outline' as const, color: '#1AAE5F', bg: '#E8F9EF', text: 'Certificate verified', detail: 'ABC Technologies', date: '12 Aug 2026' },
  { icon: 'link-outline' as const, color: '#0050F5', bg: '#EAF1FF', text: 'Certificate shared', detail: 'XYZ Corporation', date: '11 Aug 2026' },
  { icon: 'checkmark-circle-outline' as const, color: '#1AAE5F', bg: '#E8F9EF', text: 'Certificate verified', detail: 'PQR Industries', date: '10 Aug 2026' },
  { icon: 'create-outline' as const, color: '#C98A00', bg: '#FFF6E5', text: 'Share link expired', detail: 'XYZ Corporation', date: '8 Aug 2026' },
  { icon: 'shield-outline' as const, color: '#E5484D', bg: '#FDEDEE', text: 'Certificate revoked by issuer', detail: 'Web Development Bootcamp', date: '3 Aug 2026' },
]

export const VERIFICATION_REQUESTS = [
  { id: 'VR-2026-001', verifier: 'ABC Technologies', certificate: 'B.E. Computer Engineering', date: '12 Aug 2026', status: 'Verified' as const },
  { id: 'VR-2026-002', verifier: 'XYZ Corporation', certificate: 'Internship Certificate', date: '11 Aug 2026', status: 'Verified' as const },
  { id: 'VR-2026-003', verifier: 'PQR Industries', certificate: 'Cloud Computing Fundamentals', date: '10 Aug 2026', status: 'Pending' as const },
  { id: 'VR-2026-004', verifier: 'Unknown Verifier', certificate: 'Training Certificate', date: '3 Aug 2026', status: 'Failed' as const },
]

export const ACTIVE_SHARES = [
  { employer: 'ABC Technologies', purpose: 'Job Application', created: '12 Aug 2026', expires: '19 Aug 2026', status: 'Active' as const },
  { employer: 'XYZ Corporation', purpose: 'Background Verification', created: '1 Aug 2026', expires: '8 Aug 2026', status: 'Expired' as const },
]