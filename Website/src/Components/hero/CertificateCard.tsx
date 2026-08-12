import { motion } from 'framer-motion'
import { ShieldCheck, Blocks, QrCode, BadgeCheck, FileCheck } from 'lucide-react'

const badges = [
  { icon: QrCode,      label: 'QR Verified',        color: '#16A34A',       x: '-50%', y: '8%'  },
  { icon: Blocks,      label: 'Blockchain Anchored', color: 'var(--blue)',   x: '108%',  y: '8%'  },
  { icon: ShieldCheck, label: 'SHA-256 Matched',     color: 'var(--blue-2)', x: '-50%', y: '62%' },
  { icon: BadgeCheck,  label: 'Issuer Verified',     color: '#16A34A',       x: '105%',  y: '62%' },
  { icon: FileCheck,   label: 'Document Protected',  color: 'var(--navy)',   x: '8%',    y: '-16%'},
]

export default function CertificateCard() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: '420px', height: '500px' }}
    >
      {/* Floating badges */}
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
          style={{
            left: badge.x,
            top: badge.y,
            background: 'white',
            border: '1px solid var(--bg-4)',
            boxShadow: '0 4px 12px rgba(0,15,62,0.08)',
            color: badge.color,
            zIndex: 10,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
        >
          <badge.icon size={12} strokeWidth={2.5} />
          {badge.label}
        </motion.div>
      ))}

      {/* Main certificate card */}
      <motion.div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid var(--bg-4)',
          boxShadow: '0 24px 64px rgba(0,15,62,0.12), 0 8px 24px rgba(0,80,245,0.08)',
          maxWidth: '340px',
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{
          scale: 1.02,
          boxShadow: '0 32px 80px rgba(0,15,62,0.16), 0 12px 32px rgba(0,80,245,0.12)',
        }}
      >
        {/* Card header */}
        <div
          className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ background: 'var(--navy)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--blue)' }}
            >
              <ShieldCheck size={12} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">CERTIFYVAULT</span>
          </div>
          <motion.div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(22,163,74,0.2)', color: '#4ADE80' }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            VERIFIED
          </motion.div>
        </div>

        {/* Card body */}
        <div className="px-6 py-5">
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: 'var(--blue)', opacity: 0.7 }}
          >
            CERTIFICATE OF ACHIEVEMENT
          </p>

          <h3 className="text-lg font-bold mb-0.5" style={{ color: 'var(--navy)' }}>
            Bachelor of Technology
          </h3>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--navy)', opacity: 0.6 }}>
            Computer Engineering
          </p>

          <div
            className="py-3 border-t border-b mb-4"
            style={{ borderColor: 'var(--bg-4)' }}
          >
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--navy)', opacity: 0.45 }}>
              AWARDED TO
            </p>
            <p className="text-base font-bold" style={{ color: 'var(--navy)' }}>Student Name</p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--navy)', opacity: 0.45 }}>
              CERTIFICATE ID
            </p>
            <p className="text-sm font-mono font-semibold" style={{ color: 'var(--blue)' }}>
              CV-2026-001245
            </p>
          </div>

          {/* Verification rows */}
          <div
            className="flex flex-col gap-2 p-3 rounded-2xl"
            style={{ background: 'var(--bg-2)' }}
          >
            {[
              { label: 'SHA-256',    status: '✓ MATCHED',   ok: true },
              { label: 'BLOCKCHAIN', status: '✓ VERIFIED',  ok: true },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold"
                  style={{ color: 'var(--navy)', opacity: 0.5 }}
                >
                  {row.label}
                </span>
                <motion.span
                  className="text-xs font-bold"
                  style={{ color: row.ok ? 'var(--success)' : 'var(--danger)' }}
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                >
                  {row.status}
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Card footer */}
        <div className="px-6 pb-5 flex items-end justify-between">
          <div>
            <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>Issued 2026</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              ABC University
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--navy)' }}
          >
            <QrCode size={24} color="white" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
