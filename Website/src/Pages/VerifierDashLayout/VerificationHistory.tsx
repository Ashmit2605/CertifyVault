import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Eye, QrCode, Upload, Hash, Filter } from 'lucide-react'
import { MOCK_HISTORY } from '../../data/verifierMockData'
import type { VerificationStatus } from '../../types/verifier'

const filters: { label: string; value: VerificationStatus | 'all' }[] = [
  { label: 'All',          value: 'all'      },
  { label: 'Verified',     value: 'verified' },
  { label: 'Needs Review', value: 'review'   },
  { label: 'Failed',       value: 'failed'   },
]

const statusConfig = {
  verified: { icon: CheckCircle,   color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'      },
  review:   { icon: AlertTriangle, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review'  },
  failed:   { icon: XCircle,       color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  label: 'Failed'        },
  pending:  { icon: CheckCircle,   color: 'var(--blue)', bg: 'var(--light-blue)', label: 'Pending'       },
}

const methodIcon = {
  qr:     <QrCode  size={12} strokeWidth={2} />,
  upload: <Upload  size={12} strokeWidth={2} />,
  id:     <Hash    size={12} strokeWidth={2} />,
}

export default function VerificationHistory() {
  const [activeFilter, setActiveFilter] = useState<VerificationStatus | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? MOCK_HISTORY
    : MOCK_HISTORY.filter(h => h.status === activeFilter)

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>HISTORY</span>
          <h1 className="font-extrabold mt-2 mb-1" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--navy)' }}>
            Verification History
          </h1>
          <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            All certificates you have verified, with full audit trail.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Filter size={14} style={{ color: 'var(--navy)', opacity: 0.4 }} />
          <div className="flex gap-1.5">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  background: activeFilter === f.value ? 'var(--blue)' : 'white',
                  color: activeFilter === f.value ? 'white' : 'var(--navy)',
                  border: `1px solid ${activeFilter === f.value ? 'var(--blue)' : 'var(--bg-5)'}`,
                  opacity: activeFilter === f.value ? 1 : 0.65,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-3)' }}>
                  <CheckCircle size={24} strokeWidth={1.5} style={{ color: 'var(--navy)', opacity: 0.3 }} />
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--navy)' }}>No results</p>
                <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>No verifications match this filter.</p>
              </div>
            ) : (
              filtered.map((item, i) => {
                const cfg = statusConfig[item.status]
                const StatusIcon = cfg.icon
                return (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-2xl border bg-white group transition-all duration-200"
                    style={{ borderColor: 'var(--bg-4)' }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,15,62,0.06)' }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                      <StatusIcon size={16} strokeWidth={2} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--navy)' }}>{item.certificateType}</p>
                        <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: 'var(--navy)', opacity: 0.35 }}>
                          {methodIcon[item.method]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <p className="text-xs font-mono" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.certificateId}</p>
                        <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.3 }}>·</span>
                        <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.holderName}</p>
                        <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.3 }}>·</span>
                        <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.institution}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-xs font-bold" style={{ color: 'var(--navy)', opacity: 0.5 }}>{item.trustScore}</span>
                      <p className="text-xs hidden sm:block" style={{ color: 'var(--navy)', opacity: 0.35 }}>{item.verifiedAt}</p>
                      <button
                        className="w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}
                        aria-label="View"
                      >
                        <Eye size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
