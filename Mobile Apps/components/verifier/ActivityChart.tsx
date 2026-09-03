import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const NAVY = '#000F3E'
const BLUE = '#0050F5'
const BG4  = '#E8ECF8'

interface Props {
  data: { day: string; count: number }[]
}

export default function ActivityChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.count))
  const BAR_HEIGHT = 72

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Verification Activity</Text>
          <Text style={styles.sub}>This week</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>106 total</Text>
        </View>
      </View>
      <View style={styles.chart}>
        {data.map(d => (
          <View key={d.day} style={styles.barCol}>
            <View style={[styles.barTrack, { height: BAR_HEIGHT }]}>
              <View style={[styles.bar, { height: (d.count / max) * BAR_HEIGHT }]} />
            </View>
            <Text style={styles.dayLabel}>{d.day}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card:      { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BG4, backgroundColor: 'white' },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title:     { fontSize: 13, fontWeight: '700', color: NAVY },
  sub:       { fontSize: 11, color: NAVY, opacity: 0.45, marginTop: 2 },
  badge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: '#EEF3FF' },
  badgeText: { fontSize: 11, fontWeight: '600', color: BLUE },
  chart:     { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barCol:    { flex: 1, alignItems: 'center', gap: 6 },
  barTrack:  { width: '100%', justifyContent: 'flex-end' },
  bar:       { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6, backgroundColor: '#EEF3FF' },
  dayLabel:  { fontSize: 10, fontWeight: '500', color: NAVY, opacity: 0.4 },
})
