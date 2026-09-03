import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import VerificationInput from '@/components/verifier/VerificationInput'
import VerificationTimeline from '@/components/verifier/VerificationTimeline'
import VerificationResult from '@/components/verifier/VerificationResult'
import {
  MOCK_VERIFIED_RESULT,
  MOCK_SUSPICIOUS_RESULT,
  VERIFICATION_STEPS,
} from '@/data/verifierMockData'
import type { VerificationResult as VResult, VerificationMethod } from '@/data/verifierMockData'
import { Brand } from '@/constants/theme'

type Stage = 'idle' | 'processing' | 'result'

export default function VerifyScreen() {
  const [stage, setStage]           = useState<Stage>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult]         = useState<VResult | null>(null)
  const [demoMode, setDemoMode]     = useState<'verified' | 'suspicious'>('verified')

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
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <Text style={s.eyebrow}>VERIFY</Text>
          <Text style={s.title}>Verify a Certificate</Text>
          <Text style={s.subtitle}>Scan a QR code, upload a file, or enter a certificate ID.</Text>
        </View>

        {/* Demo toggle */}
        <View style={s.demoRow}>
          <Text style={s.demoLabel}>Demo mode:</Text>
          {(['verified', 'suspicious'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              onPress={() => setDemoMode(mode)}
              style={[
                s.demoBtn,
                demoMode === mode && (mode === 'verified' ? s.demoBtnVerified : s.demoBtnSuspicious),
              ]}
            >
              <Text style={[
                s.demoBtnText,
                { color: demoMode === mode ? (mode === 'verified' ? Brand.success : Brand.danger) : Brand.navy },
                { opacity: demoMode === mode ? 1 : 0.45 },
              ]}>
                {mode === 'verified' ? '✓ Verified' : '⚠ Suspicious'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardIconBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Brand.blue} />
            </View>
            <View>
              <Text style={s.cardTitle}>Verify a Certificate</Text>
              <Text style={s.cardSub}>Scan, upload, or enter a certificate ID</Text>
            </View>
          </View>
          <View style={s.cardBody}>
            {stage === 'idle' && <VerificationInput onVerify={runVerification} />}
            {stage === 'processing' && (
              <View style={s.processingWrap}>
                <Text style={s.processingText}>Analyzing certificate...</Text>
                <VerificationTimeline steps={VERIFICATION_STEPS} currentStep={currentStep} />
              </View>
            )}
            {stage === 'result' && result && (
              <VerificationResult result={result} onReset={reset} />
            )}
          </View>
        </View>

        {/* Security strip */}
        <View style={s.strip}>
          <Ionicons name="shield-checkmark" size={16} color="white" style={{ opacity: 0.7 }} />
          <View style={{ flex: 1 }}>
            <Text style={s.stripTitle}>Your verification is protected.</Text>
            {['SHA-256 integrity', 'Encrypted processing', 'Blockchain-backed proof'].map(item => (
              <Text key={item} style={s.stripItem}>· {item}</Text>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Brand.bg2 },
  content:        { padding: 20, gap: 16, paddingBottom: 40 },
  header:         { gap: 4 },
  eyebrow:        { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue },
  title:          { fontSize: 26, fontWeight: '800', color: Brand.navy, letterSpacing: -0.5 },
  subtitle:       { fontSize: 13, color: Brand.navy, opacity: 0.5, lineHeight: 20 },
  demoRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  demoLabel:      { fontSize: 11, fontWeight: '500', color: Brand.navy, opacity: 0.45 },
  demoBtn:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Brand.bg4 },
  demoBtnVerified:  { backgroundColor: 'rgba(22,163,74,0.12)' },
  demoBtnSuspicious:{ backgroundColor: 'rgba(220,38,38,0.10)' },
  demoBtnText:    { fontSize: 12, fontWeight: '600' },
  card:           { borderRadius: 24, borderWidth: 1, borderColor: Brand.bg4, backgroundColor: 'white', overflow: 'hidden' },
  cardHeader:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: Brand.bg4 },
  cardIconBox:    { width: 36, height: 36, borderRadius: 10, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  cardTitle:      { fontSize: 13, fontWeight: '700', color: Brand.navy },
  cardSub:        { fontSize: 11, color: Brand.navy, opacity: 0.45 },
  cardBody:       { padding: 16 },
  processingWrap: { gap: 20, paddingVertical: 12 },
  processingText: { textAlign: 'center', fontSize: 13, fontWeight: '600', color: Brand.navy, opacity: 0.6 },
  strip:          { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 20, backgroundColor: Brand.navy },
  stripTitle:     { fontSize: 12, fontWeight: '700', color: 'white', marginBottom: 4 },
  stripItem:      { fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 18 },
})
