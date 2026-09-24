import { useRef, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Easing, Pressable, useWindowDimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

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

// Height needed to fit the full CTA without clipping
const COLLAPSED_BASE = 245

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { height: winH } = useWindowDimensions()

  const collapsedH = COLLAPSED_BASE + insets.bottom
  const expandedH  = Math.max(430, winH * 0.6) + insets.bottom

  const progress = useRef(new Animated.Value(0)).current
  const scrollY  = useRef(new Animated.Value(0)).current
  const [open, setOpen] = useState(false)

  const setSheet = (toOpen: boolean) => {
    setOpen(toOpen)
    Animated.timing(progress, {
      toValue: toOpen ? 1 : 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // height can't use the native driver
    }).start()
  }

  // ── Sheet height ──────────────────────────────────────────────
  // Closed height shrinks as the user scrolls: full CTA → compact bar.
  const closedSheetHeight = scrollY.interpolate({
    inputRange: [0, 100, 160],
    outputRange: [
      collapsedH,           // full CTA panel
      120 + insets.bottom,  // mid-shrink
      82 + insets.bottom,   // compact CTA bar
    ],
    extrapolate: 'clamp',
  })

  // Open/close blends from the current closed height up to expandedH.
  const sheetHeight = Animated.add(
    closedSheetHeight,
    Animated.multiply(
      progress,
      Animated.subtract(expandedH, closedSheetHeight)
    )
  )

  // ── Full CTA animations (fade + drift up on scroll) ───────────
  const fullCtaOpacity = scrollY.interpolate({
    inputRange: [0, 60, 130],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  })

  const fullCtaTranslateY = scrollY.interpolate({
    inputRange: [0, 130],
    outputRange: [0, 35],
    extrapolate: 'clamp',
  })

  // ── Compact CTA animations (fade in + slide up on scroll) ─────
  const compactCtaOpacity = scrollY.interpolate({
    inputRange: [60, 120, 160],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp',
  })

  const compactCtaTranslateY = scrollY.interpolate({
    inputRange: [60, 160],
    outputRange: [25, 0],
    extrapolate: 'clamp',
  })

  // ── Sheet layer cross-fade (collapsed ↔ expanded login) ───────
  const collapsedOpacity = progress.interpolate({
    inputRange: [0, 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })
  const expandedOpacity = progress.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const goToLogin = () => router.push('/(auth)/sign-in')

  return (
    <View style={s.root}>
      {/* ───────── Scrollable content (upper part) ───────── */}
      <SafeAreaView style={s.safe} edges={['top']}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: collapsedH + 24 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
              listener: (event: any) => {
                if (open && event.nativeEvent.contentOffset.y > 10) {
                  setSheet(false)
                }
              },
            }
          )}
          onTouchStart={() => {
            if (open) {
              setSheet(false)
            }
          }}
        >

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
              <TouchableOpacity style={s.btnPrimary} onPress={() => setSheet(true)} activeOpacity={0.85}>
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

        </Animated.ScrollView>
      </SafeAreaView>

      {/* ───────── Dim background when sheet is expanded ───────── */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, s.overlay, { opacity: progress }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSheet(false)} />
      </Animated.View>

      {/* ───────── Bottom sheet ───────── */}
      <Animated.View style={[s.sheet, { height: sheetHeight }]}>

        {/* ── FULL CTA (visible at top, fades out on scroll) ── */}
        <Animated.View
          pointerEvents={open ? 'none' : 'auto'}
          style={[
            s.sheetLayer,
            {
              opacity: Animated.multiply(collapsedOpacity, fullCtaOpacity),
              paddingBottom: insets.bottom + 16,
              transform: [
                { translateY: fullCtaTranslateY },
              ],
            },
          ]}
        >
          <View style={s.brandRow}>
            <View style={s.brandIcon}>
              <Ionicons name="shield-checkmark" size={16} color="white" />
            </View>
            <Text style={s.brandText}>CertifyVault</Text>
          </View>
          <Text style={s.sheetHeading}>Your credentials. Their trust.{'\n'}
            <Text style={s.sheetAccent}>One platform.</Text>
          </Text>
          <Text style={s.sheetSub}>
            Build a future where every achievement can be verified — instantly, securely, and without doubt.
          </Text>
          <TouchableOpacity style={s.sheetBtn} onPress={() => setSheet(true)} activeOpacity={0.85}>
            <Text style={s.btnPrimaryText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={15} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* ── COMPACT CTA (fades in on scroll, replaces full CTA) ── */}
        <Animated.View
          pointerEvents={open ? 'none' : 'auto'}
          style={[
            s.compactCta,
            {
              opacity: Animated.multiply(
                collapsedOpacity,
                compactCtaOpacity
              ),
              transform: [
                { translateY: compactCtaTranslateY },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={s.compactCtaButton}
            onPress={() => setSheet(true)}
            activeOpacity={0.85}
          >
            <View style={s.compactBrand}>
              <View style={s.compactIcon}>
                <Ionicons name="shield-checkmark" size={20} color="white" />
              </View>
              <Text style={s.compactBrandText}>CERTIFYVAULT</Text>
            </View>

            <View style={s.compactGetStarted}>
              <Text style={s.compactGetStartedText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={15} color="white" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── EXPANDED: login options ── */}
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={[s.sheetLayer, { opacity: expandedOpacity, paddingBottom: insets.bottom + 16 }]}
        >
          <Pressable style={s.handleWrap} onPress={() => setSheet(false)} hitSlop={12}>
            <View style={s.handle} />
          </Pressable>

          <Text style={s.loginTitle}>Login</Text>
          <Text style={s.loginSub}>
            Don't have an account?{' '}
            <Text style={s.loginLink} onPress={goToLogin}>Sign Up</Text>
          </Text>

          <TouchableOpacity style={s.sheetBtn} onPress={goToLogin} activeOpacity={0.85}>
            <Ionicons name="mail-outline" size={17} color="white" />
            <Text style={s.btnPrimaryText}>Continue with Email</Text>
          </TouchableOpacity>

          <Text style={s.orText}>Or Continue With</Text>

          <View style={s.socialRow}>
            <TouchableOpacity
              style={[s.socialBtn, s.socialApple]}
              onPress={() => { /* TODO: Apple sign-in */ }}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-apple" size={18} color="white" />
              <Text style={[s.socialText, { color: 'white' }]}>Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.socialBtn, s.socialGoogle]}
              onPress={() => { /* TODO: Google sign-in */ }}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-google" size={16} color={Brand.navy} />
              <Text style={[s.socialText, { color: Brand.navy }]}>Google</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  root:             { flex: 1, backgroundColor: Brand.bg },
  safe:             { flex: 1, backgroundColor: Brand.bg },

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

  // Overlay
  overlay:          { backgroundColor: 'rgba(0,0,0,0.4)' },

  // Bottom sheet
  sheet:            { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', shadowColor: Brand.navy, shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 20 },
  sheetLayer:       { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 22, justifyContent: 'flex-end' },

  // Sheet — collapsed (full CTA)
  brandRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  brandIcon:        { width: 28, height: 28, borderRadius: 8, backgroundColor: Brand.blue, alignItems: 'center', justifyContent: 'center' },
  brandText:        { fontSize: 24, fontWeight: '800', color: Brand.blue, letterSpacing: -0.3 },
  sheetHeading:     { marginTop: 14, fontSize: 22, fontWeight: '800', color: Brand.navy, textAlign: 'center', letterSpacing: -0.3, lineHeight: 30 },
  sheetAccent:      { color: Brand.blue },
  sheetSub:         { marginTop: 8, fontSize: 13, color: Brand.navy, opacity: 0.5, textAlign: 'center', lineHeight: 20 },
  sheetBtn:         { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 16, backgroundColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4 },

  // Sheet — compact CTA (appears on scroll)
  compactCta: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 8,
    height: 66,
    zIndex: 20,
  },
  compactCtaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  compactBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#0B5CFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  compactBrandText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#07164D',
  },
  compactGetStarted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B5CFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  compactGetStartedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },

  // Sheet — expanded (login)
  handleWrap:       { alignSelf: 'center', paddingBottom: 12 },
  handle:           { width: 40, height: 4, borderRadius: 2, backgroundColor: Brand.bg4 },
  loginTitle:       { fontSize: 26, fontWeight: '800', color: Brand.navy, textAlign: 'center', letterSpacing: -0.4 },
  loginSub:         { marginTop: 6, marginBottom: 4, fontSize: 13, color: Brand.navy, opacity: 0.6, textAlign: 'center' },
  loginLink:        { color: Brand.blue, fontWeight: '700' },
  orText:           { marginTop: 20, marginBottom: 14, fontSize: 12, color: Brand.navy, opacity: 0.5, textAlign: 'center' },
  socialRow:        { flexDirection: 'row', gap: 12 },
  socialBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16 },
  socialApple:      { backgroundColor: Brand.navy },
  socialGoogle:     { backgroundColor: 'white', borderWidth: 1.5, borderColor: Brand.bg5 },
  socialText:       { fontSize: 14, fontWeight: '600' },
})