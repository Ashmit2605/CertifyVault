import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { TrustScore as TrustScoreType } from '../../types/verifier'

interface Props {
  trustScore: TrustScoreType
  size?: number
}

export default function TrustScore({ trustScore, size = 140 }: Props) {
  const [animated, setAnimated] = useState(0)
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (animated / 100) * circumference
  const gap = circumference - progress

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(trustScore.score), 200)
    return () => clearTimeout(timer)
  }, [trustScore.score])

  const ringColor =
    trustScore.score >= 80 ? '#16A34A' :
    trustScore.score >= 50 ? '#D97706' : '#DC2626'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--bg-4)" strokeWidth={8}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: gap }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-extrabold leading-none"
            style={{ fontSize: size * 0.26, color: ringColor }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {animated}
          </motion.span>
          <span className="text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.4 }}>/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--navy)', opacity: 0.4 }}>TRUST SCORE</p>
        <p className="font-bold text-sm mt-0.5" style={{ color: ringColor }}>{trustScore.label}</p>
      </div>
    </div>
  )
}
