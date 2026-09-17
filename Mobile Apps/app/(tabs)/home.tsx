import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const trustItems: { icon: IoniconsName; label: string }[] = [
  { icon: 'lock-closed-outline',     label: 'AES-256 Encrypted'    },
  { icon: 'shield-checkmark-outline',label: 'SHA-256 Hashing'       },
  { icon: 'cube-outline',            label: 'Blockchain Anchored'   },
  { icon: 'qr-code-outline',         label: 'QR Verification'       },
  { icon: 'eye-off-outline',         label: 'Privacy First'         },
  { icon: 'document-text-outline',   label: 'Full Audit Trail'      },
]

const steps: { num: string; icon: IoniconsName; title: string; desc: string }[] = [
  { num: '01', icon: 'add-circle-outline',      title: 'Issue',   desc: 'Institutions create and issue certificates through CertifyVault.' },
  { num: '02', icon: 'shield-checkmark-outline',title: 'Protect', desc: 'Stored with AES-256 encryption and SHA-256 fingerprinting.'       },
  { num: '03', icon: 'cube-outline',            title: 'Anchor',  desc: 'Integrity proof recorded on blockchain — tamper-evident.'          },
  { num: '04', icon: 'checkmark-circle-outline',title: 'Verify',  desc: 'Verify instantly via QR scan or certificate upload.'               },
]

const roles: { icon: IoniconsName; role: string; title: string; desc: string; features: string[] }[] = [
  {
    icon: 'business-outline',
    role: 'ISSUERS',
    title: 'Universities & Institutions',
    desc: 'Issue, manage, and protect credentials at scale.',
    features: ['Bulk issuance', 'Custom templates', 'Revocation control', 'Audit trails'],
  },
  {
    icon: 'school-outline',
    role: 'HOLDERS',
    title: 'Students & Graduates',
    desc: 'Your achievements secured in one digital vault.',
    features: ['Digital vault', 'Share via QR', 'Privacy controls', 'Any device'],
  },
  {
    icon: 'search-outline',
    role: 'VERIFIERS',
    title: 'Employers & Organizations',
    desc: 'Verify any credential in seconds with a clear trust score.',
    features: ['Scan QR code', 'Upload certificate', 'AI fraud detection', 'Risk scoring'],
  },
]

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Hero ── */}
        <View style={s.hero}>
          <View style={s.logoPill}>
            <Ionicons name="shield-checkmark" size={14} color={Brand.blue} />
            <Text style={s.logoPillText}>TRUSTED DIGITAL CREDENTIALS</Text>
          </View>
          <Text style={s.heroHeading}>Verify Every Credential.{' '}
            <Text style={s.heroAccent}>Trust Every Achievement.</Text>
          </Text>
          <Text style={s.heroSub}>
            CertifyVault lets institutions securely issue, store, and verify academic credentials — with AI-powered fraud detection.
          </Text>
          <View style={s.heroBtns}>
            <TouchableOpacity style={s.btnPrimary} onPress={() => router.push('/(auth)/sign-in')} activeOpacity={0.85}>
              <Text style={s.btnPrimaryText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={15} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={s.btnOutline} onPress={() => router.push('/(verifier)')} activeOpacity={0.8}>
              <Ionicons name="scan-outline" size={15} color={Brand.navy} />
              <Text style={s.btnOutlineText}>Verify a Certificate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Mini cert card ── */}
        <View style={s.cardWrap}>
          <View style={s.certCard}>
            <View style={s.certCardHeader}>
              <View style={s.certHeaderLeft}>
                <View style={s.certIconBox}>
                  <Ionicons name="shield-checkmark" size={11} color="white" />
                </View>
                <Text style={s.certBrand}>CERTIFYVAULT</Text>
              </View>
              <View style={s.verifiedPill}>
                <View style={s.verifiedDot} />
                <Text style={s.verifiedText}>VERIFIED</Text>
              </View>
            </View>
            <View style={s.certBody}>
              <Text style={s.certLabel}>CERTIFICATE OF ACHIEVEMENT</Text>
              <Text style={s.certTitle}>Bachelor of Technology</Text>
              <Text style={s.certSub}>Computer Engineering</Text>
              <View style={s.certDivider} />
              <View style={s.certMeta}>
                <View>
                  <Text style={s.certMetaLabel}>AWARDED TO</Text>
                  <Text style={s.certMetaVal}>Student Name</Text>
                </View>
                <View style={s.certQr}>
                  <Ionicons name="qr-code" size={22} color="white" />
                </View>
              </View>
              <View style={s.certChecks}>
                {['SHA-256  ✓ MATCHED', 'BLOCKCHAIN  ✓ VERIFIED'].map(row => (
                  <View key={row} style={s.certCheckRow}>
                    <Text style={s.certCheckLabel}>{row.split('  ')[0]}</Text>
                    <Text style={s.certCheckVal}>{row.split('  ')[1]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── Trust bar ── */}
        <View style={s.section}>
          <Text style={s.eyebrow}>SECURE BY DESIGN</Text>
          <View style={s.trustGrid}>
            {trustItems.map(item => (
              <View key={item.label} style={s.trustItem}>
                <Ionicons name={item.icon} size={14} color={Brand.blue} />
                <Text style={s.trustLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── How it works ── */}
        <View style={[s.section, s.sectionAlt]}>
          <Text style={s.eyebrow}>HOW IT WORKS</Text>
          <Text style={s.sectionTitle}>From Issuance to{'\n'}Verification in Four Steps</Text>
          <View style={s.stepsList}>
            {steps.map((step, i) => (
              <View key={step.num} style={s.stepRow}>
                <View style={s.stepLeft}>
                  <View style={s.stepIconBox}>
                    <Ionicons name={step.icon} size={16} color="white" />
                  </View>
                  {i < steps.length - 1 && <View style={s.stepLine} />}
                </View>
                <View style={s.stepContent}>
                  <Text style={s.stepNum}>{step.num}</Text>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={s.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Roles ── */}
        <View style={s.section}>
          <Text style={s.eyebrow}>BUILT FOR EVERYONE</Text>
          <Text style={s.sectionTitle}>Built for Everyone Who{'\n'}Touches a Credential</Text>
          <View style={s.rolesList}>
            {roles.map(role => (
              <View key={role.role} style={s.roleCard}>
                <View style={s.roleCardTop}>
                  <View style={s.roleIconBox}>
                    <Ionicons name={role.icon} size={18} color={Brand.blue} />
                  </View>
                  <Text style={s.roleTag}>{role.role}</Text>
                </View>
                <Text style={s.roleTitle}>{role.title}</Text>
                <Text style={s.roleDesc}>{role.desc}</Text>
                <View style={s.roleFeatures}>
                  {role.features.map(f => (
                    <View key={f} style={s.roleFeatureItem}>
                      <View style={s.roleDot} />
                      <Text style={s.roleFeatureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <View style={s.cta}>
          <Text style={s.ctaHeading}>Your credentials.{'\n'}Their trust.{'\n'}
            <Text style={s.ctaAccent}>One platform.</Text>
          </Text>
          <Text style={s.ctaSub}>Build a future where every achievement can be verified — instantly, securely, and without doubt.</Text>
          <TouchableOpacity style={s.ctaBtn} onPress={() => router.push('/(auth)/sign-in')} activeOpacity={0.85}>
            <Text style={s.ctaBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={15} color="white" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Brand.bg },
  scroll:           { paddingBottom: 40 },

  // Hero
  hero:             { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32, gap: 16 },
  logoPill:         { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: Brand.lightBlue },
  logoPillText:     { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: Brand.blue },
  heroHeading:      { fontSize: 32, fontWeight: '800', color: Brand.navy, letterSpacing: -0.5, lineHeight: 40 },
  heroAccent:       { color: Brand.blue },
  heroSub:          { fontSize: 14, color: Brand.navy, opacity: 0.55, lineHeight: 22 },
  heroBtns:         { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 4 },
  btnPrimary:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 14, backgroundColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 4 },
  btnPrimaryText:   { fontSize: 14, fontWeight: '700', color: 'white' },
  btnOutline:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 14, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  btnOutlineText:   { fontSize: 14, fontWeight: '600', color: Brand.navy },

  // Cert card
  cardWrap:         { paddingHorizontal: 24, paddingBottom: 8 },
  certCard:         { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Brand.bg4, shadowColor: Brand.navy, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 3 },
  certCardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Brand.navy },
  certHeaderLeft:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  certIconBox:      { width: 22, height: 22, borderRadius: 6, backgroundColor: Brand.blue, alignItems: 'center', justifyContent: 'center' },
  certBrand:        { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)' },
  verifiedPill:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(22,163,74,0.2)' },
  verifiedDot:      { width: 5, height: 5, borderRadius: 3, backgroundColor: '#4ADE80' },
  verifiedText:     { fontSize: 9, fontWeight: '700', color: '#4ADE80' },
  certBody:         { padding: 16, backgroundColor: 'white', gap: 4 },
  certLabel:        { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue, opacity: 0.7 },
  certTitle:        { fontSize: 16, fontWeight: '800', color: Brand.navy },
  certSub:          { fontSize: 12, color: Brand.navy, opacity: 0.55 },
  certDivider:      { height: 1, backgroundColor: Brand.bg4, marginVertical: 10 },
  certMeta:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  certMetaLabel:    { fontSize: 9, fontWeight: '600', color: Brand.navy, opacity: 0.4, marginBottom: 2 },
  certMetaVal:      { fontSize: 14, fontWeight: '700', color: Brand.navy },
  certQr:           { width: 40, height: 40, borderRadius: 10, backgroundColor: Brand.navy, alignItems: 'center', justifyContent: 'center' },
  certChecks:       { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: Brand.bg2, gap: 6 },
  certCheckRow:     { flexDirection: 'row', justifyContent: 'space-between' },
  certCheckLabel:   { fontSize: 10, fontWeight: '600', color: Brand.navy, opacity: 0.45 },
  certCheckVal:     { fontSize: 10, fontWeight: '700', color: Brand.success },

  // Sections
  section:          { paddingHorizontal: 24, paddingVertical: 36, gap: 20 },
  sectionAlt:       { backgroundColor: Brand.bg2 },
  eyebrow:          { fontSize: 10, fontWeight: '700', letterSpacing: 1.8, color: Brand.blue },
  sectionTitle:     { fontSize: 22, fontWeight: '800', color: Brand.navy, letterSpacing: -0.3, lineHeight: 30 },

  // Trust bar
  trustGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  trustItem:        { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Brand.bg4, backgroundColor: 'white' },
  trustLabel:       { fontSize: 12, fontWeight: '500', color: Brand.navy, opacity: 0.65 },

  // Steps
  stepsList:        { gap: 0 },
  stepRow:          { flexDirection: 'row', gap: 16 },
  stepLeft:         { alignItems: 'center', width: 36 },
  stepIconBox:      { width: 36, height: 36, borderRadius: 10, backgroundColor: Brand.navy, alignItems: 'center', justifyContent: 'center' },
  stepLine:         { flex: 1, width: 1.5, backgroundColor: Brand.bg4, marginVertical: 4 },
  stepContent:      { flex: 1, paddingBottom: 24, gap: 2 },
  stepNum:          { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue, opacity: 0.6 },
  stepTitle:        { fontSize: 15, fontWeight: '700', color: Brand.navy },
  stepDesc:         { fontSize: 13, color: Brand.navy, opacity: 0.5, lineHeight: 20 },

  // Roles
  rolesList:        { gap: 12 },
  roleCard:         { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: Brand.bg4, backgroundColor: 'white', gap: 8 },
  roleCardTop:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roleIconBox:      { width: 36, height: 36, borderRadius: 10, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  roleTag:          { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue, opacity: 0.7 },
  roleTitle:        { fontSize: 15, fontWeight: '700', color: Brand.navy },
  roleDesc:         { fontSize: 13, color: Brand.navy, opacity: 0.5, lineHeight: 20 },
  roleFeatures:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  roleFeatureItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  roleDot:          { width: 4, height: 4, borderRadius: 2, backgroundColor: Brand.blue },
  roleFeatureText:  { fontSize: 12, color: Brand.navy, opacity: 0.6 },

  // CTA
  cta:              { margin: 24, padding: 28, borderRadius: 24, backgroundColor: Brand.navy, gap: 14 },
  ctaHeading:       { fontSize: 28, fontWeight: '800', color: 'white', letterSpacing: -0.5, lineHeight: 36 },
  ctaAccent:        { color: Brand.blue4 },
  ctaSub:           { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 20 },
  ctaBtn:           { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 13, paddingHorizontal: 20, borderRadius: 14, backgroundColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 4 },
  ctaBtnText:       { fontSize: 14, fontWeight: '700', color: 'white' },
})
