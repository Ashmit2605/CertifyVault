import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import VerificationInput from '@/components/verifier/VerificationInput'
import VerificationTimeline from '@/components/verifier/VerificationTimeline'
import VerificationResult from '@/components/verifier/VerificationResult'
import StatsBar from '@/components/verifier/StatsBar'
import RecentVerifications from '@/components/verifier/RecentVerifications'
import ActivityChart from '@/components/verifier/ActivityChart'
import {
  MOCK_VERIFIED_RESULT,
  MOCK_SUSPICIOUS_RESULT,
  MOCK_HISTORY,
  MOCK_STATS,
  MOCK_CHART_DATA,
  VERIFICATION_STEPS,
} from '@/data/verifierMockData'
import type { VerificationResult as VResult, VerificationMethod } from '@/data/verifierMockData'

const BLUE = '#0050F5'
const NAVY = '#000F3E'
const BG2  = '#F5F7FF'
const BG4  = '#E8ECF8'

type Stage = 'idle' | 'processing' | 'result'

export default function VerifierDashboard() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState<VResult | null>(null)
  const [demoMode, setDemoMode] = useState<'verified' | 'suspicious'>('verified')

  const runVerification = (_method: VerificationMethod) => {
    setStage('processing')
    setCurrentStep(0)
    VERIFICATION_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i)
        if (i === VERIFICATION_STEPS.length - 1) {
          setTimeout(() => {
            setResult(demoMode === 'verified' ? MOCK_VERIFIED_RESULT : MOCK_SUSPICIOUS_RESULT)
            setStage('result')
          }, 500)
        }
      }, i * 600)
    })
  }

  const reset = () => { setStage('idle'); setCurrentStep(0); setResult(null) }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CERTIFICATE VERIFICATION</Text>
          <Text style={styles.title}>Verify with confidence.</Text>
          <Text style={styles.subtitle}>Upload a certificate, scan its QR code, or enter a certificate ID to verify its authenticity.</Text>
        </View>

        {/* Demo mode toggle */}
        <View style={styles.demoRow}>
          <Text style={styles.demoLabel}>Demo mode:</Text>
          {(['verified', 'suspicious'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              onPress={() => setDemoMode(mode)}
              style={[styles.demoBtn, demoMode === mode && (mode === 'verified' ? styles.demoBtnVerified : styles.demoBtnSuspicious)]}
            >
              <Text style={[styles.demoBtnText, { color: demoMode === mode ? (mode === 'verified' ? '#16A34A' : '#DC2626') : NAVY, opacity: demoMode === mode ? 1 : 0.5 }]}>
                {mode === 'verified' ? '✓ Verified' : '⚠ Suspicious'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Verification card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={BLUE} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Verify a Certificate</Text>
              <Text style={styles.cardSub}>Scan, upload, or enter a certificate ID</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {stage === 'idle' && <VerificationInput onVerify={runVerification} />}

            {stage === 'processing' && (
              <View style={styles.processingWrap}>
                <Text style={styles.processingText}>Analyzing certificate...</Text>
                <VerificationTimeline steps={VERIFICATION_STEPS} currentStep={currentStep} />
              </View>
            )}

            {stage === 'result' && result && (
              <VerificationResult result={result} onReset={reset} />
            )}
          </View>
        </View>

        {/* Stats */}
        <StatsBar stats={MOCK_STATS} />

        {/* Recent verifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Verifications</Text>
            <TouchableOpacity onPress={() => router.push('/(verifier)/history')} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons name="arrow-forward" size={12} color={BLUE} />
            </TouchableOpacity>
          </View>
          <RecentVerifications items={MOCK_HISTORY} limit={5} />
        </View>

        {/* Activity chart */}
        <ActivityChart data={MOCK_CHART_DATA} />

        {/* Security strip */}
        <View style={styles.securityStrip}>
          <Ionicons name="shield-checkmark" size={18} color="white" style={{ opacity: 0.7 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Your verification is protected.</Text>
            {['SHA-256 integrity', 'Encrypted processing', 'Blockchain-backed proof', 'Secure records'].map(item => (
              <Text key={item} style={styles.securityItem}>· {item}</Text>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: BG2 },
  scroll:          { flex: 1 },
  content:         { padding: 20, gap: 20, paddingBottom: 40 },
  header:          { gap: 6 },
  eyebrow:         { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: BLUE },
  title:           { fontSize: 28, fontWeight: '800', color: NAVY, letterSpacing: -0.5 },
  subtitle:        { fontSize: 13, color: NAVY, opacity: 0.55, lineHeight: 20 },
  demoRow:         { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  demoLabel:       { fontSize: 11, fontWeight: '500', color: NAVY, opacity: 0.45 },
  demoBtn:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: BG4 },
  demoBtnVerified: { backgroundColor: 'rgba(22,163,74,0.12)' },
  demoBtnSuspicious:{ backgroundColor: 'rgba(220,38,38,0.10)' },
  demoBtnText:     { fontSize: 12, fontWeight: '600' },
  card:            { borderRadius: 24, borderWidth: 1, borderColor: BG4, backgroundColor: 'white', overflow: 'hidden' },
  cardHeader:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: BG4 },
  cardIconBox:     { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF3FF', alignItems: 'center', justifyContent: 'center' },
  cardTitle:       { fontSize: 13, fontWeight: '700', color: NAVY },
  cardSub:         { fontSize: 11, color: NAVY, opacity: 0.45 },
  cardBody:        { padding: 16 },
  processingWrap:  { gap: 20, paddingVertical: 12 },
  processingText:  { textAlign: 'center', fontSize: 13, fontWeight: '600', color: NAVY, opacity: 0.6 },
  section:         { gap: 12 },
  sectionHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle:    { fontSize: 13, fontWeight: '700', color: NAVY },
  viewAllBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText:     { fontSize: 12, fontWeight: '600', color: BLUE },
  securityStrip:   { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 20, backgroundColor: NAVY },
  securityTitle:   { fontSize: 12, fontWeight: '700', color: 'white', marginBottom: 6 },
  securityItem:    { fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 18 },
})
