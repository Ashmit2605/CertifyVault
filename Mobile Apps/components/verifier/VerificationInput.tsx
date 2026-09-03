import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { VerificationMethod } from '@/data/verifierMockData'

const BLUE = '#0050F5'
const NAVY = '#000F3E'
const BG2 = '#F5F7FF'
const BG4 = '#E8ECF8'
const BG5 = '#D4DAF0'

const methods: { id: VerificationMethod; icon: keyof typeof Ionicons.glyphMap; label: string; sub: string }[] = [
  { id: 'qr',     icon: 'qr-code-outline',     label: 'Scan QR',        sub: 'Use camera'      },
  { id: 'upload', icon: 'cloud-upload-outline', label: 'Upload File',    sub: 'PDF · PNG · JPG' },
  { id: 'id',     icon: 'key-outline',          label: 'Certificate ID', sub: 'Enter manually'  },
]

interface Props {
  onVerify: (method: VerificationMethod, value?: string) => void
}

export default function VerificationInput({ onVerify }: Props) {
  const [method, setMethod] = useState<VerificationMethod>('upload')
  const [certId, setCertId] = useState('')

  return (
    <View>
      {/* Method tabs */}
      <View style={styles.tabs}>
        {methods.map(m => {
          const active = method === m.id
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Ionicons name={m.icon} size={18} color={active ? BLUE : NAVY} style={{ opacity: active ? 1 : 0.4 }} />
              <Text style={[styles.tabLabel, { color: active ? BLUE : NAVY, opacity: active ? 1 : 0.5 }]}>{m.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* QR panel */}
      {method === 'qr' && (
        <View style={styles.panel}>
          <View style={styles.qrFrame}>
            {/* Corner brackets */}
            <View style={[styles.corner, { top: 12, left: 12, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 8 }]} />
            <View style={[styles.corner, { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 8 }]} />
            <View style={[styles.corner, { bottom: 12, left: 12, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 8 }]} />
            <View style={[styles.corner, { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 8 }]} />
            <Ionicons name="qr-code-outline" size={48} color={NAVY} style={{ opacity: 0.15 }} />
          </View>
          <Text style={styles.hint}>Position the QR code within the frame</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => onVerify('qr')}>
            <Ionicons name="scan-outline" size={16} color="white" />
            <Text style={styles.primaryBtnText}>Use Demo QR</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upload panel */}
      {method === 'upload' && (
        <View style={styles.panel}>
          <TouchableOpacity style={styles.dropZone} onPress={() => onVerify('upload')}>
            <View style={styles.uploadIcon}>
              <Ionicons name="cloud-upload-outline" size={24} color={NAVY} style={{ opacity: 0.5 }} />
            </View>
            <Text style={styles.dropTitle}>Tap to select certificate</Text>
            <Text style={styles.dropSub}>PDF · PNG · JPG — max 10 MB</Text>
            <View style={styles.browseBtn}>
              <Text style={styles.browseBtnText}>Browse Files</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.hint, { marginTop: 8 }]}>Demo — tap to simulate verification</Text>
        </View>
      )}

      {/* ID panel */}
      {method === 'id' && (
        <View style={styles.panel}>
          <Text style={styles.inputLabel}>Certificate ID</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={certId}
              onChangeText={setCertId}
              placeholder="CV-2026-001245"
              placeholderTextColor={NAVY + '66'}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => onVerify('id', certId || 'CV-2026-001245')}>
              <Text style={styles.primaryBtnText}>Verify</Text>
              <Ionicons name="arrow-forward" size={15} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onVerify('id', 'CV-2026-001245')}>
            <Text style={styles.demoLink}>Use demo ID: CV-2026-001245 →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  tabs:          { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tab:           { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 16, borderWidth: 2, borderColor: BG5, backgroundColor: 'white' },
  tabActive:     { borderColor: BLUE, backgroundColor: '#EEF3FF' },
  tabLabel:      { fontSize: 11, fontWeight: '600' },
  panel:         { alignItems: 'center', gap: 12 },
  qrFrame:       { width: 200, height: 200, borderRadius: 24, backgroundColor: BG2, borderWidth: 1, borderColor: BG4, alignItems: 'center', justifyContent: 'center' },
  corner:        { position: 'absolute', width: 20, height: 20, borderColor: BLUE },
  hint:          { fontSize: 12, color: NAVY, opacity: 0.5, textAlign: 'center' },
  primaryBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, backgroundColor: BLUE },
  primaryBtnText:{ color: 'white', fontWeight: '600', fontSize: 14 },
  dropZone:      { width: '100%', alignItems: 'center', gap: 12, paddingVertical: 32, paddingHorizontal: 20, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: BG5, backgroundColor: BG2 },
  uploadIcon:    { width: 56, height: 56, borderRadius: 16, backgroundColor: BG4, alignItems: 'center', justifyContent: 'center' },
  dropTitle:     { fontSize: 14, fontWeight: '600', color: NAVY },
  dropSub:       { fontSize: 12, color: NAVY, opacity: 0.45 },
  browseBtn:     { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: BG5, backgroundColor: 'white' },
  browseBtnText: { fontSize: 13, fontWeight: '600', color: NAVY },
  inputLabel:    { alignSelf: 'flex-start', fontSize: 12, fontWeight: '600', color: NAVY, opacity: 0.55, marginBottom: 4 },
  inputRow:      { flexDirection: 'row', gap: 8, width: '100%' },
  input:         { flex: 1, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: BG5, fontSize: 13, fontFamily: 'monospace', color: NAVY, backgroundColor: 'white' },
  demoLink:      { fontSize: 12, color: BLUE, opacity: 0.7, marginTop: 4 },
})
