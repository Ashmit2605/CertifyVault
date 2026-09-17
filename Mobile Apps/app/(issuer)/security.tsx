import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

/* ══════════════════════════════════════════════════════
   TYPES & MOCK DATA
   ══════════════════════════════════════════════════════ */

type SubView = 'main' | 'twoFactor' | 'sessions' | 'activity'

interface LoginEvent {
  id: string
  when: string
  ip: string
  device: string
  result: 'Success' | 'Failed'
}

// 🔧 Replace with GET /api/issuer/security/login-activity — modeled after the
// web Audit Logs table (When / IP / Device / Result), condensed for mobile.
const loginActivity: LoginEvent[] = [
  { id: 'LGN-01', when: '16 Sep 2026, 08:15 PM', ip: '203.0.113.42', device: 'Chrome · Windows', result: 'Success' },
  { id: 'LGN-02', when: '15 Sep 2026, 11:58 PM', ip: '45.33.12.90', device: 'Chrome · Android', result: 'Failed' },
  { id: 'LGN-03', when: '15 Sep 2026, 08:47 AM', ip: '203.0.113.42', device: 'Chrome · Windows', result: 'Success' },
  { id: 'LGN-04', when: '13 Sep 2026, 06:20 PM', ip: '192.0.2.15', device: 'Safari · iPhone', result: 'Success' },
]

const sessionItems = [
  { device: 'Current Device', value: 'Chrome • Windows', note: 'Active now' },
  { device: 'Other Devices', value: 'Android', note: 'Last active: 2 hours ago' },
  { device: '', value: 'iPhone', note: 'Last active: Yesterday' },
]

/* ══════════════════════════════════════════════════════
   SMALL SHARED PIECES
   ══════════════════════════════════════════════════════ */

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onBack} style={s.backBtn}>
        <Ionicons name="arrow-back" size={20} color={Brand.navy} />
      </TouchableOpacity>
      <Text style={s.headerTitle}>{title}</Text>
      <View style={{ width: 20 }} />
    </View>
  )
}

function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.toggleTrack, { backgroundColor: on ? Brand.blue : '#D9E2F3' }]}
      activeOpacity={0.8}
    >
      <View style={[s.toggleThumb, { alignSelf: on ? 'flex-end' : 'flex-start' }]} />
    </TouchableOpacity>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN SECURITY SCREEN (default export)
   ══════════════════════════════════════════════════════ */

export default function Security() {
  const router = useRouter()
  const [view, setView] = useState<SubView>('main')

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginVerification, setLoginVerification] = useState(true)

  const goBack = () => {
    if (view !== 'main') {
      setView('main')
    } else {
      router.replace('/(issuer)/profile')
    }
  }

  if (view === 'twoFactor') {
    return (
      <TwoFactorScreen
        enabled={twoFactorEnabled}
        onEnable={() => setTwoFactorEnabled(true)}
        onDisable={() => setTwoFactorEnabled(false)}
        onBack={goBack}
      />
    )
  }
  if (view === 'sessions') {
    return <ActiveSessionsScreen onBack={goBack} />
  }
  if (view === 'activity') {
    return <SecurityActivityScreen onBack={goBack} />
  }

  // ── Main Security page ──
  return (
    <SafeAreaView style={s.safe}>
      <ScreenHeader title="Security" onBack={goBack} />

      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.cardLarge}>
          <Text style={s.cardBodyTitle}>Account Security</Text>
          <View style={s.divider} />

          {/* Two-Factor Authentication — own setup flow */}
          <TouchableOpacity style={s.itemRow} onPress={() => setView('twoFactor')} activeOpacity={0.7}>
            <View style={s.itemLeft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Brand.navy} />
              <View style={s.itemTextWrap}>
                <Text style={s.itemLabel}>Two-Factor Authentication</Text>
                <Text style={s.itemDetail}>Protect your account with an additional verification step.</Text>
              </View>
            </View>
            <Text style={s.itemStatus}>{twoFactorEnabled ? '[ On ]' : '[ Off ]'}</Text>
          </TouchableOpacity>

          {/* Login Verification — inline toggle, no sub-page */}
          <TouchableOpacity
            style={s.itemRow}
            onPress={() => setLoginVerification((v) => !v)}
            activeOpacity={0.7}
          >
            <View style={s.itemLeft}>
              <Ionicons name="shield-outline" size={18} color={Brand.navy} />
              <View style={s.itemTextWrap}>
                <Text style={s.itemLabel}>Login Verification</Text>
                <Text style={s.itemDetail}>Require verification when logging in from a new device.</Text>
              </View>
            </View>
            <Text style={s.itemStatus}>{loginVerification ? '[ On ]' : '[ Off ]'}</Text>
          </TouchableOpacity>

          {/* Active Sessions — navigates within this file */}
          <TouchableOpacity style={s.itemRow} onPress={() => setView('sessions')} activeOpacity={0.7}>
            <View style={s.itemLeft}>
              <Ionicons name="flash-outline" size={18} color={Brand.navy} />
              <View style={s.itemTextWrap}>
                <Text style={s.itemLabel}>Active Sessions</Text>
                <Text style={s.itemDetail}>View devices currently logged into your account.</Text>
              </View>
            </View>
            <Text style={s.itemStatus}>{'>'}</Text>
          </TouchableOpacity>

          {/* Recent Security Activity — navigates within this file */}
          <TouchableOpacity
            style={[s.itemRow, s.itemRowLast]}
            onPress={() => setView('activity')}
            activeOpacity={0.7}
          >
            <View style={s.itemLeft}>
              <Ionicons name="time-outline" size={18} color={Brand.navy} />
              <View style={s.itemTextWrap}>
                <Text style={s.itemLabel}>Recent Security Activity</Text>
                <Text style={s.itemDetail}>Last login</Text>
                <Text style={s.metaText}>{loginActivity[0].when}</Text>
              </View>
            </View>
            <Text style={s.itemStatus}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

/* ══════════════════════════════════════════════════════
   TWO-FACTOR AUTHENTICATION — setup flow (internal view)
   ══════════════════════════════════════════════════════ */

function TwoFactorScreen({
  enabled, onEnable, onDisable, onBack,
}: {
  enabled: boolean
  onEnable: () => void
  onDisable: () => void
  onBack: () => void
}) {
  const [code, setCode] = useState('')
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  const backupCodes = ['4F2A-9K1L', '7B3C-2M8N', 'X1Q9-4R6T', 'P0Z5-8W3E']

  const handleVerify = () => {
    // 🔧 Call POST /api/issuer/security/2fa/verify with `code` here
    if (code.length !== 6) {
      Alert.alert('Invalid code', 'Enter the 6-digit code from your authenticator app.')
      return
    }
    onEnable()
    setCode('')
  }

  const handleDisable = () => {
    Alert.alert('Disable Two-Factor Authentication?', 'Your account will only require a password to sign in.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Disable', style: 'destructive', onPress: onDisable },
    ])
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScreenHeader title="Two-Factor Authentication" onBack={onBack} />
      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.cardLarge}>
          <View style={s.itemRow}>
            <View style={s.itemLeft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Brand.navy} />
              <View style={s.itemTextWrap}>
                <Text style={s.itemLabel}>Authenticator App</Text>
                <Text style={s.itemDetail}>Require a code from your phone at login.</Text>
              </View>
            </View>
            <Toggle on={enabled} onPress={enabled ? handleDisable : () => setCode('')} />
          </View>

          {!enabled && (
            <View style={s.setupBlock}>
              <Text style={s.setupStep}>1. Scan this QR code with Google Authenticator or Authy</Text>
              <View style={s.qrBox}>
                <Ionicons name="qr-code-outline" size={48} color={Brand.navy} />
              </View>

              <Text style={s.setupStep}>2. Enter the 6-digit code it generates</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
                placeholderTextColor="#94A3B8"
                style={s.codeInput}
              />

              <TouchableOpacity style={s.primaryBtn} onPress={handleVerify}>
                <Text style={s.primaryBtnText}>Verify & Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          {enabled && (
            <View style={s.setupBlock}>
              <Text style={s.enabledText}>✓ Two-factor authentication is active on your account.</Text>

              <TouchableOpacity style={s.secondaryBtn} onPress={() => setShowBackupCodes((v) => !v)}>
                <Text style={s.secondaryBtnText}>
                  {showBackupCodes ? 'Hide Backup Codes' : 'View Backup Codes'}
                </Text>
              </TouchableOpacity>

              {showBackupCodes && (
                <View style={s.backupCodesBox}>
                  {backupCodes.map((c) => (
                    <Text key={c} style={s.backupCode}>{c}</Text>
                  ))}
                  <Text style={s.backupCodesNote}>Each code can be used once if you lose access to your device.</Text>
                </View>
              )}

              <TouchableOpacity onPress={handleDisable}>
                <Text style={s.dangerText}>Disable Two-Factor Authentication</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

/* ══════════════════════════════════════════════════════
   ACTIVE SESSIONS (internal view)
   ══════════════════════════════════════════════════════ */

function ActiveSessionsScreen({ onBack }: { onBack: () => void }) {
  const handleLogoutAll = () => {
    Alert.alert('Log out all other devices?', 'You\'ll stay signed in here, but all other sessions will end.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          // 🔧 Call POST /api/issuer/security/sessions/revoke-all here
        },
      },
    ])
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScreenHeader title="Active Sessions" onBack={onBack} />
      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.cardSlim}>
          <View style={s.sessionSection}>
            <Text style={s.sessionDevice}>{sessionItems[0].device}</Text>
            <Text style={s.sessionValue}>{sessionItems[0].value}</Text>
            <Text style={s.sessionNote}>{sessionItems[0].note}</Text>
          </View>

          <View style={s.sessionSection}>
            <Text style={s.sessionDevice}>Other Devices</Text>
            {sessionItems.slice(1).map((item) => (
              <View key={item.value} style={s.deviceRow}>
                <Text style={s.sessionValue}>{item.value}</Text>
                <Text style={s.sessionNote}>{item.note}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleLogoutAll}>
            <Text style={s.logoutText}>[ Log Out All Other Devices ]</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

/* ══════════════════════════════════════════════════════
   SECURITY ACTIVITY (internal view)
   Modeled after the web Audit Logs table: When / IP / Device / Result
   ══════════════════════════════════════════════════════ */

function SecurityActivityScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={s.safe}>
      <ScreenHeader title="Security Activity" onBack={onBack} />
      <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.cardSlim}>
          {loginActivity.map((log, i) => (
            <View key={log.id} style={[s.activityLogRow, i === loginActivity.length - 1 && s.itemRowLast]}>
              <View style={{ flex: 1 }}>
                <Text style={s.sessionValue}>{log.when}</Text>
                <Text style={s.sessionNote}>{log.ip} · {log.device}</Text>
              </View>
              <Text
                style={[
                  s.resultBadge,
                  log.result === 'Success' ? s.resultSuccess : s.resultFailed,
                ]}
              >
                {log.result}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

/* ══════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════ */

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Brand.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: Brand.navy, fontSize: 16, fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 20 },

  cardLarge: {
    backgroundColor: '#F7F9FF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Brand.bg4,
    marginTop: 8,
  },
  cardSlim: {
    backgroundColor: '#F7F9FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Brand.bg4,
    marginTop: 8,
  },
  cardBodyTitle: { color: Brand.navy, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  divider: { height: 1, backgroundColor: Brand.bg4, marginBottom: 4 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Brand.bg4,
  },
  itemRowLast: { borderBottomWidth: 0 },
  itemLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 12 },
  itemTextWrap: { marginLeft: 10, flex: 1 },
  itemLabel: { color: Brand.navy, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemDetail: { color: Brand.navy, fontSize: 12, lineHeight: 18, opacity: 0.7 },
  metaText: { color: Brand.navy, fontSize: 12, opacity: 0.7, marginTop: 4 },
  itemStatus: { color: Brand.navy, fontSize: 12, fontWeight: '600', marginTop: 4 },

  toggleTrack: {
    width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center', marginTop: 2,
  },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },

  setupBlock: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Brand.bg4 },
  setupStep: { color: Brand.navy, fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 14 },
  qrBox: {
    width: 140, height: 140, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: Brand.bg4,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: '#FFFFFF',
  },
  codeInput: {
    borderWidth: 1, borderColor: Brand.bg4, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14,
    fontSize: 18, letterSpacing: 6, textAlign: 'center', color: Brand.navy, backgroundColor: '#FFFFFF',
  },
  primaryBtn: {
    backgroundColor: Brand.blue, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 16,
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: '#EAF1FF', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4,
  },
  secondaryBtnText: { color: Brand.blue, fontSize: 13, fontWeight: '700' },
  enabledText: { color: Brand.navy, fontSize: 13, fontWeight: '600', marginBottom: 14 },
  backupCodesBox: {
    backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: Brand.bg4, padding: 14, marginTop: 12,
  },
  backupCode: { color: Brand.navy, fontSize: 14, fontWeight: '600', letterSpacing: 1, marginBottom: 6 },
  backupCodesNote: { color: Brand.navy, fontSize: 11, opacity: 0.6, marginTop: 6 },
  dangerText: {
    color: '#F43F5E', fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 18,
  },

  sessionSection: { marginBottom: 14 },
  sessionDevice: { color: Brand.navy, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sessionValue: { color: Brand.navy, fontSize: 14, marginBottom: 2 },
  sessionNote: { color: Brand.navy, fontSize: 12, opacity: 0.7 },
  deviceRow: { marginTop: 10 },
  logoutText: { color: Brand.blue, fontSize: 13, marginTop: 12, textAlign: 'center', fontWeight: '600' },

  activityLogRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Brand.bg4,
  },
  resultBadge: { fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: 'hidden' },
  resultSuccess: { color: '#059669', backgroundColor: '#ECFDF5' },
  resultFailed: { color: '#E11D48', backgroundColor: '#FFF1F2' },
})