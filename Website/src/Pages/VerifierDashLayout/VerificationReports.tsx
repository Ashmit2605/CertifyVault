import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Eye, CheckCircle, AlertTriangle } from 'lucide-react'
import { MOCK_SUSPICIOUS_RESULT, MOCK_VERIFIED_RESULT } from '../../data/verifierMockData'
import type { VerificationResult as VResult } from '../../types/verifier'
import VerificationResult from '../../Components/VerifierDashComponents/VerificationResult'
import { downloadVerificationReport } from '../../utils/verificationReport'

const reports = [
  { id: 'r1', title: 'B.Tech Certificate — Arjun Mehta',   id_: 'CV-2026-001245', status: 'verified' as const, score: 96, date: '12 Aug 2026' },
  { id: 'r2', title: 'Internship Certificate — Priya Sharma', id_: 'CV-2026-001198', status: 'verified' as const, score: 91, date: '12 Aug 2026' },
  { id: 'r3', title: 'Diploma Certificate — Unknown',      id_: 'CV-2025-009871', status: 'review'   as const, score: 23, date: '11 Aug 2026' },
  { id: 'r4', title: 'MBA Certificate — Sarah Wilson',     id_: 'CV-2026-001102', status: 'verified' as const, score: 88, date: '11 Aug 2026' },
]

const statusConfig = {
  verified: { icon: CheckCircle,   color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'     },
  review:   { icon: AlertTriangle, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review' },
}

export default function VerificationReports() {
  const [selectedResult, setSelectedResult] = useState<VResult | null>(null)

  const getDetailedResult = (certificateId: string) => {
    if (certificateId === MOCK_VERIFIED_RESULT.certificate.id) return MOCK_VERIFIED_RESULT
    if (certificateId === MOCK_SUSPICIOUS_RESULT.certificate.id) return MOCK_SUSPICIOUS_RESULT
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>REPORTS</span>
          <h1 className="font-extrabold mt-2 mb-1" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--navy)' }}>
            Verification Reports
          </h1>
          <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            Detailed reports with certificate information, verification checks, blockchain proof, and risk assessment.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {reports.map((report, i) => {
            const cfg = statusConfig[report.status]
            const StatusIcon = cfg.icon
            const detailedResult = getDetailedResult(report.id_)
            return (
              <motion.div
                key={report.id}
                className="flex items-center gap-4 p-5 rounded-3xl border group transition-all duration-200"
                style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,15,62,0.07)' }}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--bg-3)' }}>
                  <FileText size={18} strokeWidth={1.5} style={{ color: 'var(--navy)', opacity: 0.5 }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--navy)' }}>{report.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs font-mono" style={{ color: 'var(--navy)', opacity: 0.4 }}>{report.id_}</p>
                    <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.3 }}>·</span>
                    <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>{report.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon size={13} strokeWidth={2.5} style={{ color: cfg.color }} />
                    <span className="text-xs font-semibold hidden sm:block" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                    {report.score}
                  </span>
                  <div className="flex items-center gap-1 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      disabled={!detailedResult}
                      onClick={() => detailedResult && setSelectedResult(detailedResult)}
                      title={detailedResult ? 'View detailed report' : 'Detailed result is not available in this demo'}
                      className="w-7 h-7 rounded-xl flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}
                      aria-label="View detailed report"
                    >
                      <Eye size={13} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      disabled={!detailedResult}
                      onClick={() => detailedResult && downloadVerificationReport(detailedResult)}
                      title={detailedResult ? 'Download detailed report' : 'Detailed result is not available in this demo'}
                      className="w-7 h-7 rounded-xl flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ background: 'var(--bg-3)', color: 'var(--navy)' }}
                      aria-label="Download detailed report"
                    >
                      <Download size={13} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      {selectedResult && (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/50 p-4 sm:p-8"
          onClick={() => setSelectedResult(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Verification report details"
            className="mx-auto my-6 max-w-3xl rounded-3xl bg-white p-5 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <VerificationResult result={selectedResult} onReset={() => setSelectedResult(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
