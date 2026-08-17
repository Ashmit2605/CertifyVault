import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

interface Props {
  steps: { id: string; label: string }[]
  currentStep: number
}

export default function VerificationTimeline({ steps, currentStep }: Props) {
  return (
    <div className="flex flex-col gap-0 w-full max-w-sm mx-auto">
      {steps.map((step, i) => {
        const done    = i < currentStep
        const active  = i === currentStep
        const pending = i > currentStep

        return (
          <div key={step.id} className="flex items-start gap-3">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                animate={{
                  background: done ? '#16A34A' : active ? 'var(--blue)' : 'var(--bg-4)',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {done ? (
                  <Check size={13} color="white" strokeWidth={3} />
                ) : active ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 size={13} color="white" strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--bg-5)' }} />
                )}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className="w-px"
                  style={{ height: '28px' }}
                  animate={{ background: done ? '#16A34A' : 'var(--bg-4)' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>

            {/* Label */}
            <div className="pt-1 pb-5">
              <motion.p
                className="text-sm font-medium"
                animate={{
                  color: done ? '#16A34A' : active ? 'var(--navy)' : 'var(--navy)',
                  opacity: done ? 0.8 : active ? 1 : 0.35,
                }}
                transition={{ duration: 0.3 }}
              >
                {step.label}
              </motion.p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
