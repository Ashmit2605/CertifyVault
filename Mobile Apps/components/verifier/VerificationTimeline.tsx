import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const BLUE = '#0050F5'
const NAVY = '#000F3E'
const BG4 = '#E8ECF8'

interface Props {
  steps: { id: string; label: string }[]
  currentStep: number
}

export default function VerificationTimeline({ steps, currentStep }: Props) {
  return (
    <View style={styles.container}>
      {steps.map((step, i) => {
        const done    = i < currentStep
        const active  = i === currentStep
        const dotBg   = done ? '#16A34A' : active ? BLUE : BG4
        const lineBg  = done ? '#16A34A' : BG4
        const textColor = done ? '#16A34A' : active ? NAVY : NAVY
        const textOpacity = done ? 0.8 : active ? 1 : 0.35

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.track}>
              <View style={[styles.dot, { backgroundColor: dotBg }]}>
                {done  && <Ionicons name="checkmark" size={12} color="white" />}
                {active && <Ionicons name="reload-outline" size={12} color="white" />}
                {!done && !active && <View style={styles.innerDot} />}
              </View>
              {i < steps.length - 1 && <View style={[styles.line, { backgroundColor: lineBg }]} />}
            </View>
            <Text style={[styles.label, { color: textColor, opacity: textOpacity }]}>{step.label}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center', width: '100%', maxWidth: 320 },
  row:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  track:     { alignItems: 'center' },
  dot:       { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  innerDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C0C8E0' },
  line:      { width: 2, height: 24, marginTop: 2 },
  label:     { fontSize: 13, fontWeight: '500', paddingTop: 6, paddingBottom: 20, flex: 1 },
})
