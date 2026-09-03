import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { VerifierStats } from '@/data/verifierMockData'

const NAVY = '#000F3E'
const BG3  = '#EEF1FA'
const BG4  = '#E8ECF8'

interface Props { stats: VerifierStats }

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Total',        value: stats.total,    color: NAVY,      bg: BG3 },
    { label: 'Verified',     value: stats.verified, color: '#16A34A', bg: 'rgba(22,163,74,0.08)'  },
    { label: 'Needs Review', value: stats.review,   color: '#D97706', bg: 'rgba(217,119,6,0.08)'  },
    { label: 'Failed',       value: stats.failed,   color: '#DC2626', bg: 'rgba(220,38,38,0.08)'  },
  ]

  return (
    <View style={styles.grid}>
      {items.map(item => (
        <View key={item.label} style={[styles.card, { backgroundColor: 'white', borderColor: BG4 }]}>
          <View style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
          </View>
          <Text style={[styles.value, { color: item.color }]}>{item.value}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card:  { width: '47%', padding: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 11, fontWeight: '500', color: NAVY, opacity: 0.5 },
  dot:   { width: 8, height: 8, borderRadius: 4 },
  value: { fontSize: 26, fontWeight: '800' },
})
