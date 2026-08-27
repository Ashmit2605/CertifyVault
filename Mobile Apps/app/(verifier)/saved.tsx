import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { SAVED_VERIFICATIONS } from '@/data/verifierMockData'

const BLUE = '#0050F5'
const NAVY = '#000F3E'
const BG2  = '#F5F7FF'
const BG4  = '#E8ECF8'

const statusConfig = {
  verified: { icon: 'shield-checkmark' as const, color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'     },
  review:   { icon: 'warning'          as const, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review' },
}

export default function SavedVerifications() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SAVED</Text>
          <Text style={styles.title}>Saved Verifications</Text>
          <Text style={styles.subtitle}>Frequently referenced credentials saved for quick access.</Text>
        </View>

        {SAVED_VERIFICATIONS.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={24} color={NAVY} style={{ opacity: 0.3 }} />
            </View>
            <Text style={styles.emptyTitle}>No saved verifications</Text>
            <Text style={styles.emptySub}>Save a verification to access it quickly later.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {SAVED_VERIFICATIONS.map(item => {
              const cfg = statusConfig[item.status]
              return (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
                      <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                    </View>
                    <View style={styles.cardTopRight}>
                      <View style={[styles.scoreBadge, { backgroundColor: cfg.bg }]}>
                        <Text style={[styles.scoreText, { color: cfg.color }]}>{item.score}</Text>
                      </View>
                      <TouchableOpacity style={styles.viewBtn}>
                        <Ionicons name="eye-outline" size={13} color={BLUE} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.degree}>{item.degree}</Text>
                  <Text style={styles.institution}>{item.institution}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
                    <Ionicons name="bookmark" size={13} color={NAVY} style={{ opacity: 0.3 }} />
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
  empty:         { alignItems: 'center', paddingVertical: 80, gap: 8 },
  emptyIcon:     { width: 56, height: 56, borderRadius: 16, backgroundColor: BG4, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle:    { fontSize: 14, fontWeight: '600', color: NAVY },
  emptySub:      { fontSize: 12, color: NAVY, opacity: 0.45 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:          { width: '47%', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BG4, backgroundColor: 'white', gap: 6 },
  cardTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  iconBox:       { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTopRight:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreBadge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  scoreText:     { fontSize: 11, fontWeight: '700' },
  viewBtn:       { width: 28, height: 28, borderRadius: 10, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center' },
  name:          { fontSize: 14, fontWeight: '700', color: NAVY },
  degree:        { fontSize: 12, color: NAVY, opacity: 0.6 },
  institution:   { fontSize: 11, color: NAVY, opacity: 0.4 },
  cardFooter:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: BG4 },
  statusLabel:   { fontSize: 12, fontWeight: '600' },
})
