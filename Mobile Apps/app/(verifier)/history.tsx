import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { MOCK_HISTORY } from '@/data/verifierMockData'
import type { VerificationStatus } from '@/data/verifierMockData'

const BLUE = '#0050F5'
const NAVY = '#000F3E'
const BG2  = '#F5F7FF'
const BG4  = '#E8ECF8'

const filters: { label: string; value: VerificationStatus | 'all' }[] = [
  { label: 'All',          value: 'all'      },
  { label: 'Verified',     value: 'verified' },
  { label: 'Needs Review', value: 'review'   },
  { label: 'Failed',       value: 'failed'   },
]

const statusConfig = {
  verified: { icon: 'shield-checkmark' as const, color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'     },
  review:   { icon: 'warning'          as const, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review' },
  failed:   { icon: 'close-circle'     as const, color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  label: 'Failed'       },
  pending:  { icon: 'time-outline'     as const, color: BLUE,      bg: '#EEF3FF',               label: 'Pending'      },
}

const methodIcon = {
  qr:     'qr-code-outline'      as const,
  upload: 'cloud-upload-outline' as const,
  id:     'key-outline'          as const,
}

export default function VerificationHistory() {
  const [activeFilter, setActiveFilter] = useState<VerificationStatus | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? MOCK_HISTORY
    : MOCK_HISTORY.filter(h => h.status === activeFilter)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>HISTORY</Text>
          <Text style={styles.title}>Verification History</Text>
          <Text style={styles.subtitle}>All certificates you have verified, with full audit trail.</Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <Ionicons name="filter-outline" size={14} color={NAVY} style={{ opacity: 0.4, marginRight: 4 }} />
          {filters.map(f => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[styles.filterBtn, activeFilter === f.value && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, { color: activeFilter === f.value ? 'white' : NAVY, opacity: activeFilter === f.value ? 1 : 0.65 }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="shield-checkmark-outline" size={24} color={NAVY} style={{ opacity: 0.3 }} />
            </View>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySub}>No verifications match this filter.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map(item => {
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
                    <Text style={styles.meta} numberOfLines={1}>{item.certificateId} · {item.holderName}</Text>
                    <Text style={styles.meta} numberOfLines={1}>{item.institution}</Text>
                  </View>
                  <View style={styles.right}>
                    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                    </View>
                    <Text style={styles.score}>{item.trustScore}</Text>
                    <Text style={styles.time}>{item.verifiedAt}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: BG2 },
  scroll:        { flex: 1 },
  content:       { padding: 20, gap: 20, paddingBottom: 40 },
  header:        { gap: 6 },
  eyebrow:       { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: BLUE },
  title:         { fontSize: 26, fontWeight: '800', color: NAVY, letterSpacing: -0.5 },
  subtitle:      { fontSize: 13, color: NAVY, opacity: 0.5 },
  filters:       { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 4 },
  filterBtn:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: BG4, backgroundColor: 'white' },
  filterBtnActive:{ backgroundColor: BLUE, borderColor: BLUE },
  filterText:    { fontSize: 12, fontWeight: '600' },
  empty:         { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyIcon:     { width: 56, height: 56, borderRadius: 16, backgroundColor: BG4, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle:    { fontSize: 14, fontWeight: '600', color: NAVY },
  emptySub:      { fontSize: 12, color: NAVY, opacity: 0.45 },
  list:          { gap: 8 },
  row:           { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: BG4, backgroundColor: 'white' },
  iconBox:       { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  info:          { flex: 1, minWidth: 0, gap: 2 },
  titleRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  certType:      { fontSize: 13, fontWeight: '600', color: NAVY, flex: 1 },
  meta:          { fontSize: 11, color: NAVY, opacity: 0.45 },
  right:         { alignItems: 'flex-end', gap: 3 },
  badge:         { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText:     { fontSize: 10, fontWeight: '700' },
  score:         { fontSize: 12, fontWeight: '700', color: NAVY, opacity: 0.5 },
  time:          { fontSize: 10, color: NAVY, opacity: 0.35 },
})
