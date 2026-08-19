import { motion } from 'framer-motion'
import type { VerifierStats } from '../../types/verifier'

interface Props { stats: VerifierStats }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Total Verifications', value: stats.total,    color: 'var(--navy)',    bg: 'var(--bg-3)'                  },
    { label: 'Verified',            value: stats.verified, color: '#16A34A',        bg: 'rgba(22,163,74,0.08)'         },
    { label: 'Needs Review',        value: stats.review,   color: '#D97706',        bg: 'rgba(217,119,6,0.08)'         },
    { label: 'Failed',              value: stats.failed,   color: '#DC2626',        bg: 'rgba(220,38,38,0.08)'         },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className="flex flex-col gap-1 p-4 rounded-2xl border"
          style={{ background: 'white', borderColor: 'var(--bg-4)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,15,62,0.06)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.5 }}>{item.label}</span>
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
          </div>
          <motion.p
            className="font-extrabold text-2xl"
            style={{ color: item.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 + 0.2 }}
          >
            {item.value}
          </motion.p>
        </motion.div>
      ))}
    </div>
  )
}
