import { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native'
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type ScreenState = 'idle' | 'scanning' | 'processing' | 'result'

const pipelineSteps = [
  'QR detected',
  'Certificate found',
  'Hash verification',
  'Blockchain verification',
  'Fraud analysis',
]

// 🔧 Replace with your real verification API using the scanned QR payload
const mockVerifiedResult = {
  status: 'verified' as const,
  certName: 'B.Tech Computer Engineering',
  studentName: 'Rahul Sharma',
  certId: 'CV-2026-001245',
  issuer: 'PCCOER',
  documentIntegrity: true,
  blockchainVerified: true,
  riskScore: 96,
}

const mockFailedResult = {
  status: 'failed' as const,
  reasons: ['Certificate ID not found', 'Document hash mismatch', 'Possible document modification'],
}

const alertCount = 4
const userInitials = 'DS'

export default function VerifyCertificate() {
  const router = useRouter()
  const [permission, requestPermission] = useCameraPermissions()
  const [screenState, setScreenState] = useState<ScreenState>('idle')
  const [pipelineIndex, setPipelineIndex] = useState(-1)
  const [result, setResult] = useState<typeof mockVerifiedResult | typeof mockFailedResult | null>(null)
  const scannedRef = useRef(false)

  const startPipeline = () => {
    setScreenState('processing')
    setPipelineIndex(0)
    scannedRef.current = false

    pipelineSteps.forEach((_, i) => {
      setTimeout(() => {
        setPipelineIndex(i + 1)
        if (i === pipelineSteps.length - 1) {
          // 🔧 Swap in your real API result here instead of this random mock
          const outcome = Math.random() > 0.25 ? mockVerifiedResult : mockFailedResult
          setResult(outcome)
          setScreenState('result')
        }
      }, 650 * (i + 1))
    })
  }

  const handleBarcodeScanned = (scan: BarcodeScanningResult) => {
    if (scannedRef.current) return
    scannedRef.current = true
    startPipeline()
  }

  const resetScanner = () => {
    setScreenState('idle')
    setPipelineIndex(-1)
    setResult(null)
    scannedRef.current = false
  }

  const handleUpload = () => {
    // 🔧 Wire up expo-image-picker / expo-document-picker here to pick a certificate file,
    // then send it to your verification API instead of the QR flow.
    startPipeline()
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header (inline) ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Verify</Text>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/(issuer)/alert')} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={Brand.navy} />
            {alertCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{alertCount > 9 ? '9+' : alertCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(issuer)/profile')} activeOpacity={0.7}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{userInitials}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.content}>
        {/* ── Idle: show camera + upload option ── */}
        {screenState === 'idle' && (
          <>
            {!permission ? (
              <View style={s.center}>
                <ActivityIndicator color={Brand.blue} />
              </View>
            ) : !permission.granted ? (
              <View style={s.permissionBox}>
                <Ionicons name="camera-outline" size={32} color={Brand.blue} />
                <Text style={s.permissionTitle}>Camera access needed</Text>
                <Text style={s.permissionText}>
                  Allow camera access to scan certificate QR codes.
                </Text>
                <TouchableOpacity style={s.permissionBtn} onPress={requestPermission} activeOpacity={0.85}>
                  <Text style={s.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openSettings()}>
                  <Text style={s.permissionLink}>Open Settings</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={s.scannerWrap}>
                  <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={handleBarcodeScanned}
                  />
                  <View style={s.scannerFrame} />
                </View>
                <Text style={s.scanLabel}>Scan certificate QR code</Text>

                <View style={s.dividerRow}>
                  <View style={s.dividerLine} />
                  <Text style={s.dividerText}>OR</Text>
                  <View style={s.dividerLine} />
                </View>

                <TouchableOpacity style={s.uploadBtn} onPress={handleUpload} activeOpacity={0.85}>
                  <Ionicons name="cloud-upload-outline" size={18} color={Brand.blue} />
                  <Text style={s.uploadBtnText}>Upload Certificate</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {/* ── Processing pipeline ── */}
        {screenState === 'processing' && (
          <View style={s.card}>
            <View style={{ gap: 14 }}>
              {pipelineSteps.map((label, i) => {
                const done = pipelineIndex > i
                const active = pipelineIndex === i
                return (
                  <View key={label} style={s.pipelineRow}>
                    {done ? (
                      <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                    ) : active ? (
                      <ActivityIndicator size="small" color={Brand.blue} />
                    ) : (
                      <View style={s.pipelineDotIdle} />
                    )}
                    <Text style={[s.pipelineText, (done || active) && s.pipelineTextActive]}>
                      {label}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* ── Result ── */}
        {screenState === 'result' && result && (
          <View style={s.card}>
            {result.status === 'verified' ? (
              <>
                <View style={s.resultHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  <Text style={s.resultVerifiedTitle}>VERIFIED</Text>
                </View>

                <Text style={s.certName}>{result.certName}</Text>

                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>Student</Text>
                  <Text style={s.detailVal}>{result.studentName}</Text>
                </View>
                <View style={[s.detailRow, s.detailRowBorder]}>
                  <Text style={s.detailLabel}>Certificate ID</Text>
                  <Text style={s.detailVal}>{result.certId}</Text>
                </View>
                <View style={[s.detailRow, s.detailRowBorder]}>
                  <Text style={s.detailLabel}>Issuer</Text>
                  <Text style={s.detailVal}>{result.issuer}</Text>
                </View>
                <View style={[s.detailRow, s.detailRowBorder]}>
                  <Text style={s.detailLabel}>Document Integrity</Text>
                  <View style={s.checkPill}>
                    <Ionicons name="checkmark" size={12} color="#16A34A" />
                    <Text style={s.checkPillText}>Valid</Text>
                  </View>
                </View>
                <View style={[s.detailRow, s.detailRowBorder]}>
                  <Text style={s.detailLabel}>Blockchain</Text>
                  <View style={s.checkPill}>
                    <Ionicons name="checkmark" size={12} color="#16A34A" />
                    <Text style={s.checkPillText}>Verified</Text>
                  </View>
                </View>
                <View style={[s.detailRow, s.detailRowBorder]}>
                  <Text style={s.detailLabel}>Risk Score</Text>
                  <Text style={s.riskScore}>{result.riskScore}/100</Text>
                </View>
              </>
            ) : (
              <>
                <View style={s.resultHeader}>
                  <Ionicons name="close-circle" size={20} color="#DC2626" />
                  <Text style={s.resultFailedTitle}>VERIFICATION FAILED</Text>
                </View>
                <View style={{ gap: 10, marginTop: 12 }}>
                  {result.reasons.map((reason) => (
                    <View key={reason} style={s.reasonRow}>
                      <Ionicons name="alert-circle-outline" size={15} color="#DC2626" />
                      <Text style={s.reasonText}>{reason}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity style={s.scanAgainBtn} onPress={resetScanner} activeOpacity={0.85}>
              <Ionicons name="scan-outline" size={16} color="white" />
              <Text style={s.scanAgainBtnText}>Scan Another</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: Brand.bg },

  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle:         { fontSize: 22, fontWeight: '800', color: Brand.navy },
  headerRight:         { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn:             { position: 'relative' },
  badge:               { position: 'absolute', top: -4, right: -4, backgroundColor: Brand.blue, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText:           { fontSize: 9, fontWeight: '700', color: 'white' },
  avatar:              { width: 32, height: 32, borderRadius: 16, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText:          { fontSize: 12, fontWeight: '700', color: Brand.blue },

  content:             { flex: 1, paddingHorizontal: 20 },
  center:              { flex: 1, alignItems: 'center', justifyContent: 'center' },

  permissionBox:       { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 8, paddingHorizontal: 30 },
  permissionTitle:     { fontSize: 16, fontWeight: '700', color: Brand.navy, marginTop: 6 },
  permissionText:      { fontSize: 13, color: Brand.navy, opacity: 0.5, textAlign: 'center' },
  permissionBtn:       { backgroundColor: Brand.blue, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24, marginTop: 10 },
  permissionBtnText:   { fontSize: 14, fontWeight: '700', color: 'white' },
  permissionLink:      { fontSize: 12, color: Brand.blue, fontWeight: '600', marginTop: 4 },

  scannerWrap:         { height: 280, borderRadius: 20, overflow: 'hidden', backgroundColor: Brand.navy, marginTop: 8, alignItems: 'center', justifyContent: 'center' },
  scannerFrame:        { position: 'absolute', width: 190, height: 190, borderRadius: 20, borderWidth: 3, borderColor: Brand.blue },
  scanLabel:           { textAlign: 'center', fontSize: 13, fontWeight: '600', color: Brand.navy, opacity: 0.6, marginTop: 14 },

  dividerRow:          { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  dividerLine:         { flex: 1, height: 1, backgroundColor: Brand.bg4 },
  dividerText:         { fontSize: 11, fontWeight: '700', color: Brand.navy, opacity: 0.35 },

  uploadBtn:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: Brand.blue, borderRadius: 14, paddingVertical: 14 },
  uploadBtnText:       { fontSize: 14, fontWeight: '700', color: Brand.blue },

  card:                { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, padding: 16, marginTop: 8 },

  pipelineRow:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pipelineDotIdle:     { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Brand.bg4 },
  pipelineText:        { fontSize: 13, color: Brand.navy, opacity: 0.4 },
  pipelineTextActive:  { opacity: 1, fontWeight: '600' },

  resultHeader:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultVerifiedTitle: { fontSize: 15, fontWeight: '800', color: '#16A34A', letterSpacing: 0.5 },
  resultFailedTitle:   { fontSize: 15, fontWeight: '800', color: '#DC2626', letterSpacing: 0.5 },
  certName:            { fontSize: 16, fontWeight: '700', color: Brand.navy, marginTop: 10, marginBottom: 6 },

  detailRow:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  detailRowBorder:     { borderTopWidth: 1, borderTopColor: Brand.bg4 },
  detailLabel:         { fontSize: 13, color: Brand.navy, opacity: 0.55 },
  detailVal:           { fontSize: 13, fontWeight: '700', color: Brand.navy },
  checkPill:           { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  checkPillText:       { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  riskScore:           { fontSize: 14, fontWeight: '800', color: '#16A34A' },

  reasonRow:           { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reasonText:          { fontSize: 13, color: Brand.navy, opacity: 0.7, flex: 1 },

  scanAgainBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Brand.blue, borderRadius: 14, paddingVertical: 14, marginTop: 18 },
  scanAgainBtnText:    { fontSize: 14, fontWeight: '700', color: 'white' },
})