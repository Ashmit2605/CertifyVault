import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, Blocks, RotateCcw, Download, ExternalLink } from 'lucide-react'
import TrustScore from './TrustScore'
import type { VerificationResult as VResult } from '../../types/verifier'

interface Props {
  result: VResult
  onReset: () => void
}

const statusConfig = {
  verified: { icon: CheckCircle, label: 'VERIFIED',        sub: 'Certificate is authentic',    color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.2)'  },
  review:   { icon: AlertTriangle, label: 'REQUIRES REVIEW', sub: 'Suspicious signals detected', color: '#D97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.2)'  },
  failed:   { icon: XCircle,      label: 'FAILED',          sub: 'Certificate could not be verified', color: '#DC2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.2)' },
  pending:  { icon: ShieldCheck,  label: 'PENDING',         sub: 'Verification in progress',    color: 'var(--blue)', bg: 'var(--light-blue)', border: 'var(--light-blue-3)' },
}

const checkIcon = {
  pass: <CheckCircle size={14} strokeWidth={2.5} style={{ color: '#16A34A', flexShrink: 0 }} />,
  fail: <XCircle    size={14} strokeWidth={2.5} style={{ color: '#DC2626', flexShrink: 0 }} />,
  warn: <AlertTriangle size={14} strokeWidth={2.5} style={{ color: '#D97706', flexShrink: 0 }} />,
  pending: <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: 'var(--bg-5)' }} />,
}

export default function VerificationResult({ result, onReset }: Props) {
  const cfg = statusConfig[result.status]
  const StatusIcon = cfg.icon

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Status banner */}
      <div
        className="flex items-center gap-4 p-5 rounded-3xl border"
        style={{ background: cfg.bg, borderColor: cfg.border }}
      >
        <StatusIcon size={28} strokeWidth={2} style={{ color: cfg.color, flexShrink: 0 }} />
        <div className="flex-1">
          <p className="font-extrabold text-lg leading-none" style={{ color: cfg.color }}>{cfg.label}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--navy)', opacity: 0.6 }}>{cfg.sub}</p>
        </div>
        <TrustScore trustScore={result.trustScore} size={100} />
      </div>

      {/* Certificate details */}
      <div className="p-5 rounded-3xl border" style={{ background: 'white', borderColor: 'var(--bg-4)' }}>
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: 'var(--navy)', opacity: 0.4 }}>CERTIFICATE DETAILS</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Certificate ID', value: result.certificate.id },
            { label: 'Holder',         value: result.certificate.holderName },
            { label: 'Qualification',  value: result.certificate.degree },
            { label: 'Institution',    value: result.certificate.institution },
            { label: 'Issued',         value: result.certificate.issuedDate },
            { label: 'Type',           value: result.certificate.type },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-2xl" style={{ background: 'var(--bg-2)' }}>
              <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--navy)', opacity: 0.4 }}>{item.label}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification checks */}
      <div className="p-5 rounded-3xl border" style={{ background: 'white', borderColor: 'var(--bg-4)' }}>
        <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: 'var(--navy)', opacity: 0.4 }}>VERIFICATION CHECKS</p>
        <div className="flex flex-col gap-0">
          {result.checks.map((check, i) => (
            <div key={check.id}>
              <motion.div
                className="flex items-start gap-3 py-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {checkIcon[check.status]}
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>{check.label}</p>
                  {check.detail && <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.5 }}>{check.detail}</p>}
                </div>
              </motion.div>
              {i < result.checks.length - 1 && <div className="h-px ml-6" style={{ background: 'var(--bg-4)' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain proof */}
      <div className="p-5 rounded-3xl border" style={{ background: 'var(--navy)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Blocks size={16} color="white" strokeWidth={2} />
          <p className="text-xs font-semibold tracking-widest text-white opacity-70">BLOCKCHAIN PROOF</p>
        </div>
        <div className="flex flex-col gap-2.5">
          {[
            { label: 'Network',     value: result.blockchainProof.network },
            { label: 'Hash',        value: result.blockchainProof.certificateHash.slice(0, 20) + '...' },
            { label: 'Transaction', value: result.blockchainProof.transactionId.slice(0, 16) + '...' },
            { label: 'Anchored',    value: result.blockchainProof.anchoredAt },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
              <span className="text-xs font-mono font-semibold text-white">{item.value}</span>
            </div>
          ))}
        </div>
        <button
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold transition-opacity"
          style={{ color: 'var(--blue-4)' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <ExternalLink size={12} /> View on Blockchain
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm border transition-all"
          style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)', background: 'white' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
        >
          <RotateCcw size={14} /> Verify Another
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white transition-all"
          style={{ background: 'var(--blue)', boxShadow: '0 4px 12px rgba(0,80,245,0.2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)' }}
        >
          <Download size={14} /> Download Report
        </button>
      </div>
    </motion.div>
  )
}
