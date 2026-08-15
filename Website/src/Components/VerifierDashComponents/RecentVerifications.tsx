import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Eye, QrCode, Upload, Hash } from 'lucide-react'
import type { VerificationHistoryItem } from '../../types/verifier'

interface Props {
  items: VerificationHistoryItem[]
  limit?: number
}

const statusConfig = {
  verified: { icon: CheckCircle,  color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'       },
  review:   { icon: AlertTriangle, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review'   },
  failed:   { icon: XCircle,      color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  label: 'Failed'         },
  pending:  { icon: CheckCircle,  color: 'var(--blue)', bg: 'var(--light-blue)', label: 'Pending'        },
}

const methodIcon = {
  qr:     <QrCode  size={12} strokeWidth={2} />,
  upload: <Upload  size={12} strokeWidth={2} />,
  id:     <Hash    size={12} strokeWidth={2} />,
}

export default function RecentVerifications({ items, limit = 6 }: Props) {
  const displayed = items.slice(0, limit)

  return (
    <div className="flex flex-col gap-2">
      {displayed.map((item, i) => {
        const cfg = statusConfig[item.status]
        const StatusIcon = cfg.icon
        return (
          <motion.div
            key={item.id}
            className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 group"
            style={{ background: 'white', borderColor: 'var(--bg-4)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,15,62,0.06)' }}
          >
            {/* Status icon */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
              <StatusIcon size={16} strokeWidth={2} style={{ color: cfg.color }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--navy)' }}>{item.certificateType}</p>
                <span className="flex items-center gap-1 text-xs shrink-0" style={{ color: 'var(--navy)', opacity: 0.35 }}>
                  {methodIcon[item.method]}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs font-mono" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.certificateId}</p>
                <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.3 }}>·</span>
                <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.institution}</p>
              </div>
            </div>

            {/* Score + time */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {item.trustScore}
              </span>
              <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.35 }}>{item.verifiedAt}</p>
            </div>

            {/* View button */}
            <button
              className="w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}
              aria-label="View"
            >
              <Eye size={13} strokeWidth={2} />
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
