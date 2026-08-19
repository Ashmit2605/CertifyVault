import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Eye, Bookmark } from 'lucide-react'

const saved = [
  { id: 's1', name: 'Arjun Mehta',   degree: 'B.Tech Computer Engineering', institution: 'ABC University',  status: 'verified' as const, score: 96 },
  { id: 's2', name: 'Sarah Wilson',  degree: 'MBA',                          institution: 'Global B-School', status: 'verified' as const, score: 88 },
  { id: 's3', name: 'Michael Chen',  degree: 'Diploma in Business Admin',    institution: 'XYZ College',     status: 'review'   as const, score: 23 },
  { id: 's4', name: 'Priya Sharma',  degree: 'Internship Certificate',       institution: 'TechCorp Ltd',    status: 'verified' as const, score: 91 },
]

const statusConfig = {
  verified: { icon: CheckCircle,   color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'     },
  review:   { icon: AlertTriangle, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review' },
}

export default function SavedVerifications() {
  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>SAVED</span>
          <h1 className="font-extrabold mt-2 mb-1" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--navy)' }}>
            Saved Verifications
          </h1>
          <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            Frequently referenced credentials saved for quick access.
          </p>
        </motion.div>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-3)' }}>
              <Bookmark size={24} strokeWidth={1.5} style={{ color: 'var(--navy)', opacity: 0.3 }} />
            </div>
            <p className="font-semibold text-sm mb-1" style={{ color: 'var(--navy)' }}>No saved verifications</p>
            <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>Save a verification to access it quickly later.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {saved.map((item, i) => {
              const cfg = statusConfig[item.status]
              const StatusIcon = cfg.icon
              return (
                <motion.div
                  key={item.id}
                  className="p-5 rounded-3xl border group transition-all duration-200"
                  style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,15,62,0.08)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: cfg.bg }}>
                      <StatusIcon size={18} strokeWidth={2} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                        {item.score}
                      </span>
                      <button
                        className="w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}
                        aria-label="View"
                      >
                        <Eye size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                  <p className="font-bold text-base mb-0.5" style={{ color: 'var(--navy)' }}>{item.name}</p>
                  <p className="text-sm mb-1" style={{ color: 'var(--navy)', opacity: 0.6 }}>{item.degree}</p>
                  <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>{item.institution}</p>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--bg-4)' }}>
                    <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                    <Bookmark size={13} style={{ color: 'var(--navy)', opacity: 0.3 }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
