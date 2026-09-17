import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

// 🔧 Replace with your API call using the id param
const mockCertificateDetail = {
  id: 'CV-2026-001245',
  studentName: 'Rahul Sharma',
  type: 'B.Tech Degree',
  program: 'Computer Engineering',
  status: 'active' as const,
  issueDate: '12 Aug 2026',
  verificationCount: 7,
  blockchainStatus: 'confirmed',
  hash: '9f2a...c81e',
}

export default function CertificateDetails() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const cert = mockCertificateDetail // 🔧 fetch by `id` in real implementation

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Certificate Details</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.certCard}>
          <View style={s.certCardHeader}>
            <Ionicons name="shield-checkmark" size={16} color="white" />
            <Text style={s.certCardBrand}>CERTIFYVAULT</Text>
            <View style={s.verifiedPill}>
              <View style={s.verifiedDot} />
              <Text style={s.verifiedText}>ACTIVE</Text>
            </View>
          </View>
          <View style={s.certBody}>
            <Text style={s.certLabel}>{cert.type.toUpperCase()}</Text>
            <Text style={s.certTitle}>{cert.program}</Text>
            <Text style={s.certId}>{cert.id}</Text>
            <View style={s.divider} />
            <Text style={s.metaLabel}>AWARDED TO</Text>
            <Text style={s.metaVal}>{cert.studentName}</Text>
          </View>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Issue Date</Text>
            <Text style={s.infoVal}>{cert.issueDate}</Text>
          </View>
          <View style={[s.infoRow, s.infoRowBorder]}>
            <Text style={s.infoLabel}>Verifications</Text>
            <Text style={s.infoVal}>{cert.verificationCount}</Text>
          </View>
          <View style={[s.infoRow, s.infoRowBorder]}>
            <Text style={s.infoLabel}>Blockchain Status</Text>
            <View style={s.chainPill}>
              <Ionicons name="link" size={11} color={Brand.blue} />
              <Text style={s.chainText}>Confirmed</Text>
            </View>
          </View>
          <View style={[s.infoRow, s.infoRowBorder]}>
            <Text style={s.infoLabel}>SHA-256 Hash</Text>
            <Text style={s.infoValMono}>{cert.hash}</Text>
          </View>
        </View>

        <View style={s.actionsRow}>
          <TouchableOpacity style={s.actionBtn} activeOpacity={0.8}>
            <Ionicons name="download-outline" size={16} color={Brand.blue} />
            <Text style={s.actionBtnText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.revokeBtn} activeOpacity={0.8}>
            <Ionicons name="ban-outline" size={16} color="#DC2626" />
            <Text style={s.revokeBtnText}>Revoke</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Brand.bg },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn:         { width: 20 },
  headerTitle:     { fontSize: 16, fontWeight: '700', color: Brand.navy },

  scroll:          { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },

  certCard:        { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Brand.bg4 },
  certCardHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Brand.navy },
  certCardBrand:   { flex: 1, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)' },
  verifiedPill:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(22,163,74,0.2)' },
  verifiedDot:     { width: 5, height: 5, borderRadius: 3, backgroundColor: '#4ADE80' },
  verifiedText:    { fontSize: 9, fontWeight: '700', color: '#4ADE80' },
  certBody:        { padding: 16, backgroundColor: 'white', gap: 2 },
  certLabel:       { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: Brand.blue },
  certTitle:       { fontSize: 17, fontWeight: '800', color: Brand.navy, marginTop: 2 },
  certId:          { fontSize: 12, color: Brand.navy, opacity: 0.4, marginTop: 2 },
  divider:         { height: 1, backgroundColor: Brand.bg4, marginVertical: 12 },
  metaLabel:       { fontSize: 10, fontWeight: '600', color: Brand.navy, opacity: 0.4 },
  metaVal:         { fontSize: 15, fontWeight: '700', color: Brand.navy, marginTop: 2 },

  infoCard:        { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, overflow: 'hidden' },
  infoRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16 },
  infoRowBorder:   { borderTopWidth: 1, borderTopColor: Brand.bg4 },
  infoLabel:       { fontSize: 13, color: Brand.navy, opacity: 0.55 },
  infoVal:         { fontSize: 13, fontWeight: '700', color: Brand.navy },
  infoValMono:     { fontSize: 12, fontWeight: '600', color: Brand.navy, fontFamily: 'monospace' },
  chainPill:       { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Brand.lightBlue, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  chainText:       { fontSize: 11, fontWeight: '700', color: Brand.blue },

  actionsRow:      { flexDirection: 'row', gap: 10 },
  actionBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Brand.lightBlue, borderRadius: 14, paddingVertical: 13 },
  actionBtnText:   { fontSize: 13, fontWeight: '700', color: Brand.blue },
  revokeBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#FEE2E2', borderRadius: 14, paddingVertical: 13 },
  revokeBtnText:   { fontSize: 13, fontWeight: '700', color: '#DC2626' },
})