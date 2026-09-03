import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { MOCK_REPORTS } from '@/data/verifierMockData'

const BLUE = '#0050F5'
const NAVY = '#000F3E'
const BG2  = '#F5F7FF'
const BG3  = '#EEF1FA'
const BG4  = '#E8ECF8'

const statusConfig = {
  verified: { icon: 'shield-checkmark' as const, color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  label: 'Verified'     },
  review:   { icon: 'warning'          as const, color: '#D97706', bg: 'rgba(217,119,6,0.08)',  label: 'Needs Review' },
}

export default function VerificationReports() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>REPORTS</Text>
          <Text style={styles.title}>Verification Reports</Text>
          <Text style={styles.subtitle}>Detailed reports with certificate information, verification checks, blockchain proof, and risk assessment.</Text>
        </View>

        <View style={styles.list}>
          {MOCK_REPORTS.map(report => {
            const cfg = statusConfig[report.status]
            return (
              <View key={report.id} style={styles.row}>
                <View style={styles.fileIcon}>
                  <Ionicons name="document-text-outline" size={18} color={NAVY} style={{ opacity: 0.5 }} />
                </View>

                <View style={styles.info}>
                  <Text style={styles.reportTitle} numberOfLines={2}>{report.title}</Text>
                  <Text style={styles.meta}>{report.certId} · {report.date}</Text>
                </View>

                <View style={styles.right}>
                  <View style={styles.statusRow}>
                    <Ionicons name={cfg.icon} size={13} color={cfg.color} />
                    <View style={[styles.scoreBadge, { backgroundColor: cfg.bg }]}>
                      <Text style={[styles.scoreText, { color: cfg.color }]}>{report.score}</Text>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="eye-outline" size={13} color={BLUE} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: BG3 }]}>
                      <Ionicons name="download-outline" size={13} color={NAVY} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: BG3 }]}>
                      <Ionicons name="share-outline" size={13} color={NAVY} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: BG2 },
  scroll:      { flex: 1 },
  content:     { padding: 20, gap: 20, paddingBottom: 40 },
  header:      { gap: 6 },
  eyebrow:     { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: BLUE },
  title:       { fontSize: 26, fontWeight: '800', color: NAVY, letterSpacing: -0.5 },
  subtitle:    { fontSize: 13, color: NAVY, opacity: 0.5, lineHeight: 20 },
  list:        { gap: 10 },
  row:         { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BG4, backgroundColor: 'white' },
  fileIcon:    { width: 40, height: 40, borderRadius: 12, backgroundColor: BG3, alignItems: 'center', justifyContent: 'center' },
  info:        { flex: 1, minWidth: 0, gap: 4 },
  reportTitle: { fontSize: 13, fontWeight: '600', color: NAVY },
  meta:        { fontSize: 11, color: NAVY, opacity: 0.4 },
  right:       { alignItems: 'flex-end', gap: 8 },
  statusRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreBadge:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  scoreText:   { fontSize: 11, fontWeight: '700' },
  actions:     { flexDirection: 'row', gap: 4 },
  actionBtn:   { width: 28, height: 28, borderRadius: 10, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center' },
})
