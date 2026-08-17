import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Upload, Hash, ScanLine, FileUp, ArrowRight } from 'lucide-react'

type Method = 'qr' | 'upload' | 'id'

interface Props {
  onVerify: (method: Method, value?: string) => void
  loading: boolean
}

const methods = [
  { id: 'qr'     as Method, icon: QrCode,  label: 'Scan QR',       sub: 'Use camera'         },
  { id: 'upload' as Method, icon: Upload,  label: 'Upload File',   sub: 'PDF · PNG · JPG'    },
  { id: 'id'     as Method, icon: Hash,    label: 'Certificate ID', sub: 'Enter manually'     },
]

export default function VerificationInput({ onVerify, loading }: Props) {
  const [method, setMethod] = useState<Method>('upload')
  const [certId, setCertId] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full">
      {/* Method tabs */}
      <div className="flex gap-2 mb-6">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all duration-200"
            style={{
              borderColor: method === m.id ? 'var(--blue)' : 'var(--bg-5)',
              background: method === m.id ? 'var(--light-blue)' : 'white',
            }}
          >
            <m.icon size={18} strokeWidth={2} style={{ color: method === m.id ? 'var(--blue)' : 'var(--navy)', opacity: method === m.id ? 1 : 0.4 }} />
            <span className="text-xs font-semibold" style={{ color: method === m.id ? 'var(--blue)' : 'var(--navy)', opacity: method === m.id ? 1 : 0.5 }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {/* Method panels */}
      <AnimatePresence mode="wait">
        {method === 'qr' && (
          <motion.div
            key="qr"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            {/* QR scanner frame */}
            <div
              className="relative w-56 h-56 rounded-3xl flex items-center justify-center"
              style={{ background: 'var(--bg-2)', border: '1px solid var(--bg-4)' }}
            >
              {/* Corner brackets */}
              {[
                'top-3 left-3 border-t-2 border-l-2 rounded-tl-xl',
                'top-3 right-3 border-t-2 border-r-2 rounded-tr-xl',
                'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-xl',
                'bottom-3 right-3 border-b-2 border-r-2 rounded-br-xl',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: 'var(--blue)' }} />
              ))}
              {/* Scan beam */}
              <motion.div
                className="absolute left-4 right-4 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, var(--blue), transparent)' }}
                animate={{ top: ['20%', '80%', '20%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <QrCode size={40} strokeWidth={1} style={{ color: 'var(--navy)', opacity: 0.15 }} />
            </div>
            <p className="text-sm text-center" style={{ color: 'var(--navy)', opacity: 0.5 }}>
              Position the QR code within the frame
            </p>
            <button
              onClick={() => onVerify('qr')}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-200"
              style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)', opacity: loading ? 0.6 : 1 }}
            >
              <ScanLine size={16} /> Use Demo QR
            </button>
          </motion.div>
        )}

        {method === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={() => onVerify('upload')} />
            <div
              className="flex flex-col items-center gap-4 py-10 px-6 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200"
              style={{
                borderColor: dragOver ? 'var(--blue)' : 'var(--bg-5)',
                background: dragOver ? 'var(--light-blue)' : 'var(--bg-2)',
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); onVerify('upload') }}
            >
              <motion.div
                animate={{ scale: dragOver ? 1.1 : 1 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: dragOver ? 'var(--blue)' : 'var(--bg-4)' }}
              >
                <FileUp size={24} strokeWidth={1.5} style={{ color: dragOver ? 'white' : 'var(--navy)', opacity: dragOver ? 1 : 0.5 }} />
              </motion.div>
              <div className="text-center">
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--navy)' }}>
                  {dragOver ? 'Drop to verify' : 'Drop certificate here'}
                </p>
                <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>PDF · PNG · JPG — max 10 MB</p>
              </div>
              <span
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)', background: 'white' }}
              >
                Browse Files
              </span>
            </div>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--navy)', opacity: 0.35 }}>
              Demo — click or drop to simulate verification
            </p>
          </motion.div>
        )}

        {method === 'id' && (
          <motion.div
            key="id"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--navy)', opacity: 0.55 }}>
                Certificate ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certId}
                  onChange={e => setCertId(e.target.value)}
                  placeholder="CV-2026-001245"
                  className="flex-1 px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all"
                  style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)', background: 'white' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.boxShadow = 'none' }}
                  onKeyDown={e => e.key === 'Enter' && onVerify('id', certId)}
                />
                <button
                  onClick={() => onVerify('id', certId || 'CV-2026-001245')}
                  disabled={loading}
                  className="px-5 py-3 rounded-2xl font-semibold text-white flex items-center gap-2 transition-all"
                  style={{ background: 'var(--blue)', boxShadow: '0 4px 12px rgba(0,80,245,0.25)', opacity: loading ? 0.6 : 1 }}
                >
                  Verify <ArrowRight size={15} />
                </button>
              </div>
            </div>
            <button
              onClick={() => onVerify('id', 'CV-2026-001245')}
              className="text-xs font-medium text-left transition-opacity"
              style={{ color: 'var(--blue)', opacity: 0.7 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.7' }}
            >
              Use demo ID: CV-2026-001245 →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
