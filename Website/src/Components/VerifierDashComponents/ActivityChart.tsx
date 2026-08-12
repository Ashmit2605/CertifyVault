import { motion } from 'framer-motion'

interface Props {
  data: { day: string; count: number }[]
}

export default function ActivityChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.count))

  return (
    <div className="p-5 rounded-3xl border" style={{ background: 'white', borderColor: 'var(--bg-4)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Verification Activity</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.45 }}>This week</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}>
          106 total
        </span>
      </div>

      <div className="flex items-end gap-2 h-24">
        {data.map((d, i) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-end justify-center" style={{ height: '72px' }}>
              <motion.div
                className="w-full rounded-t-lg"
                style={{ background: 'var(--light-blue)', maxWidth: '32px' }}
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / max) * 72}px` }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ background: 'var(--blue)' }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.4 }}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
