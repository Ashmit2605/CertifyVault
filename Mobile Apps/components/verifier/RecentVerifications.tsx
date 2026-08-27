import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { VerificationHistoryItem } from '@/data/verifierMockData'

const NAVY = '#000F3E'
const BG4  = '#E8ECF8'
const BLUE = '#0050F5'

const statusConfig = {
  verified: { icon: 'shield-checkmark' as const, color: '#16A34A', bg: 'rgba(22,163,74,0.08)'  },
  review:   { icon: 'warning'          as const, color: '#D97706', bg: 'rgba(217,119,6,0.08)'  },
  failed:   { icon: 'close-circle'     as const, color: '#DC2626', bg: 'rgba(220,38,38,0.08)'  },
  pending:  { icon: 'time-outline'     as const, color: BLUE,      bg: '#EEF3FF'               },
}

const methodIcon = {
  qr:     'qr-code-outline'      as const,
  upload: 'cloud-upload-outline' as const,
  id:     'key-outline'          as const,
}

interface Props {
  items: VerificationHistoryItem[]
  limit?: number
}

export default function RecentVerifications({ items, limit = 6 }: Props) {
  return (
    <View style={styles.list}>
      {items.slice(0, limit).map(item => {
        const cfg = statusConfig[item.status]
        return (
          <View key={item.id} style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
              <Ionicons name={cfg.icon} size={16} color={cfg.color} />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.certType} numberOfLines={1}>{item.certificateType}</Text>
                <Ionicons name={methodIcon[item.method]} size={11} color={NAVY} style={{ opacity: 0.35 }} />
              </View>
              <Text style={styles.meta} numberOfLines={1}>{item.certificateId} · {item.institution}</Text>
            </View>
            <View style={styles.right}>
              <View style={[styles.scoreBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.scoreText, { color: cfg.color }]}>{item.trustScore}</Text>
              </View>
              <Text style={styles.time}>{item.verifiedAt}</Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  list:       { gap: 8 },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: BG4, backgroundColor: 'white' },
  iconBox:    { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  info:       { flex: 1, minWidth: 0, gap: 3 },
  titleRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  certType:   { fontSize: 13, fontWeight: '600', color: NAVY, flex: 1 },
  meta:       { fontSize: 11, color: NAVY, opacity: 0.45 },
  right:      { alignItems: 'flex-end', gap: 4 },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  scoreText:  { fontSize: 11, fontWeight: '700' },
  time:       { fontSize: 10, color: NAVY, opacity: 0.35 },
})
