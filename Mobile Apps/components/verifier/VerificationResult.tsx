import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { VerificationResult as VResult } from '@/data/verifierMockData'

const NAVY = '#000F3E'
const BLUE = '#0050F5'
const BG2  = '#F5F7FF'
const BG4  = '#E8ECF8'

const statusConfig = {
  verified: { icon: 'shield-checkmark',  label: 'VERIFIED',        sub: 'Certificate is authentic',         color: '#16A34A', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.2)'  },
  review:   { icon: 'warning',           label: 'REQUIRES REVIEW', sub: 'Suspicious signals detected',      color: '#D97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.2)'  },
  failed:   { icon: 'close-circle',      label: 'FAILED',          sub: 'Certificate could not be verified',color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.2)'  },
  pending:  { icon: 'shield-checkmark',  label: 'PENDING',         sub: 'Verification in progress',         color: BLUE,      bg: '#EEF3FF',               border: '#C7D4FF'              },
} as const

const checkIcon = {
  pass:    { name: 'checkmark-circle' as const, color: '#16A34A' },
  fail:    { name: 'close-circle'     as const, color: '#DC2626' },
  warn:    { name: 'warning'          as const, color: '#D97706' },
  pending: { name: 'ellipse-outline'  as const, color: '#C0C8E0' },
}

interface Props {
  result: VResult
  onReset: () => void
}

export default function VerificationResult({ result, onReset }: Props) {
  const cfg = statusConfig[result.status]

  return (
    <View style={styles.container}>
      {/* Status banner */}
      <View style={[styles.banner, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
        <Ionicons name={cfg.icon as any} size={28} color={cfg.color} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerLabel, { color: cfg.color }]}>{cfg.label}</Text>
          <Text style={styles.bannerSub}>{cfg.sub}</Text>
        </View>
        <View style={[styles.scoreCircle, { borderColor: cfg.color }]}>
          <Text style={[styles.scoreNum, { color: cfg.color }]}>{result.trustScore.score}</Text>
          <Text style={[styles.scoreLabel, { color: cfg.color }]}>{result.trustScore.label}</Text>
        </View>
      </View>

      {/* Certificate details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>CERTIFICATE DETAILS</Text>
        <View style={styles.detailsGrid}>
          {[
            { label: 'Certificate ID', value: result.certificate.id },
            { label: 'Holder',         value: result.certificate.holderName },
            { label: 'Qualification',  value: result.certificate.degree },
            { label: 'Institution',    value: result.certificate.institution },
            { label: 'Issued',         value: result.certificate.issuedDate },
            { label: 'Type',           value: result.certificate.type },
          ].map(item => (
            <View key={item.label} style={styles.detailItem}>
              <Text style={styles.detailKey}>{item.label}</Text>
              <Text style={styles.detailVal}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Verification checks */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>VERIFICATION CHECKS</Text>
        {result.checks.map((check, i) => {
          const ic = checkIcon[check.status]
          return (
            <View key={check.id}>
              <View style={styles.checkRow}>
                <Ionicons name={ic.name} size={16} color={ic.color} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkLabel}>{check.label}</Text>
                  {check.detail && <Text style={styles.checkDetail}>{check.detail}</Text>}
                </View>
              </View>
              {i < result.checks.length - 1 && <View style={styles.divider} />}
            </View>
          )
        })}
      </View>

      {/* Blockchain proof */}
      <View style={[styles.card, { backgroundColor: NAVY }]}>
        <View style={styles.blockchainHeader}>
          <Ionicons name="cube-outline" size={16} color="white" />
          <Text style={styles.blockchainTitle}>BLOCKCHAIN PROOF</Text>
        </View>
        {[
          { label: 'Network',     value: result.blockchainProof.network },
          { label: 'Hash',        value: result.blockchainProof.certificateHash.slice(0, 20) + '...' },
          { label: 'Transaction', value: result.blockchainProof.transactionId.slice(0, 16) + '...' },
          { label: 'Anchored',    value: result.blockchainProof.anchoredAt },
        ].map(item => (
          <View key={item.label} style={styles.blockchainRow}>
            <Text style={styles.blockchainKey}>{item.label}</Text>
            <Text style={styles.blockchainVal}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={onReset}>
          <Ionicons name="refresh-outline" size={14} color={NAVY} />
          <Text style={styles.secondaryBtnText}>Verify Another</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn}>
          <Ionicons name="download-outline" size={14} color="white" />
          <Text style={styles.primaryBtnText}>Download Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:       { gap: 16 },
  banner:          { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, borderWidth: 1 },
  bannerLabel:     { fontSize: 16, fontWeight: '800' },
  bannerSub:       { fontSize: 12, color: NAVY, opacity: 0.6, marginTop: 2 },
  scoreCircle:     { width: 64, height: 64, borderRadius: 32, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  scoreNum:        { fontSize: 20, fontWeight: '800' },
  scoreLabel:      { fontSize: 9, fontWeight: '600', opacity: 0.7 },
  card:            { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: BG4, backgroundColor: 'white', gap: 12 },
  sectionTitle:    { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: NAVY, opacity: 0.4 },
  detailsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detailItem:      { width: '47%', padding: 10, borderRadius: 12, backgroundColor: BG2 },
  detailKey:       { fontSize: 10, fontWeight: '500', color: NAVY, opacity: 0.4, marginBottom: 2 },
  detailVal:       { fontSize: 12, fontWeight: '600', color: NAVY },
  checkRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  checkLabel:      { fontSize: 13, fontWeight: '600', color: NAVY },
  checkDetail:     { fontSize: 11, color: NAVY, opacity: 0.5, marginTop: 2 },
  divider:         { height: 1, backgroundColor: BG4, marginLeft: 26 },
  blockchainHeader:{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  blockchainTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: 'white', opacity: 0.7 },
  blockchainRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  blockchainKey:   { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  blockchainVal:   { fontSize: 11, fontFamily: 'monospace', fontWeight: '600', color: 'white' },
  actions:         { flexDirection: 'row', gap: 10 },
  secondaryBtn:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: BG4, backgroundColor: 'white' },
  secondaryBtnText:{ fontSize: 13, fontWeight: '600', color: NAVY },
  primaryBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 16, backgroundColor: BLUE },
  primaryBtnText:  { fontSize: 13, fontWeight: '600', color: 'white' },
})
