import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'

type Tab = 'profile' | 'security'
type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const PROFILE_DEFAULTS = {
  fullName:     'Alex Verifier',
  email:        'alex.verifier@org.com',
  organization: 'Acme Corp',
  role:         'Verifier',
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
}

/* ── Reusable field ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={f.fieldWrap}>
      <Text style={f.fieldLabel}>{label}</Text>
      {children}
    </View>
  )
}

/* ── Security row ── */
function SecurityRow({
  icon, title, subtitle, right,
}: { icon: IoniconsName; title: string; subtitle: string; right: React.ReactNode }) {
  return (
    <View style={f.secRow}>
      <View style={f.secIconBox}>
        <Ionicons name={icon} size={15} color={Brand.navy} style={{ opacity: 0.5 }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={f.secTitle}>{title}</Text>
        <Text style={f.secSub}>{subtitle}</Text>
      </View>
      {right}
    </View>
  )
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab]   = useState<Tab>('profile')
  const [profile, setProfile]       = useState(PROFILE_DEFAULTS)
  const [twoFactor, setTwoFactor]   = useState(true)
  const [pwOpen, setPwOpen]         = useState(false)
  const [pwCurrent, setPwCurrent]   = useState('')
  const [pwNew, setPwNew]           = useState('')
  const [pwConfirm, setPwConfirm]   = useState('')
  const [toast, setToast]           = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const inputStyle = (key: string) => [
    f.input,
    focusedField === key && f.inputFocused,
  ]

  const tabs: { id: Tab; label: string; icon: IoniconsName }[] = [
    { id: 'profile',  label: 'Profile',  icon: 'person-outline'  },
    { id: 'security', label: 'Security', icon: 'shield-outline'  },
  ]

  return (
    <SafeAreaView style={f.safe}>
      <ScrollView contentContainerStyle={f.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={f.header}>
          <Text style={f.eyebrow}>ACCOUNT</Text>
          <Text style={f.title}>Profile & Settings</Text>
          <Text style={f.subtitle}>Manage your profile information and account security.</Text>
        </View>

        {/* Toast */}
        {toast && (
          <View style={f.toast}>
            <Ionicons name="checkmark-circle" size={15} color={Brand.success} />
            <Text style={f.toastText}>{toast}</Text>
          </View>
        )}

        {/* Tab switcher */}
        <View style={f.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[f.tabBtn, activeTab === tab.id && f.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={activeTab === tab.id ? Brand.blue : Brand.navy}
                style={{ opacity: activeTab === tab.id ? 1 : 0.45 }}
              />
              <Text style={[f.tabText, activeTab === tab.id && f.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <View style={f.card}>
            <Text style={f.cardTitle}>Your profile</Text>
            <Text style={f.cardSub}>This is how you appear across the verifier console.</Text>

            {/* Avatar */}
            <View style={f.avatarRow}>
              <View style={f.avatar}>
                <Text style={f.avatarText}>{initials(profile.fullName)}</Text>
              </View>
              <View style={{ gap: 4 }}>
                <TouchableOpacity style={f.uploadBtn} activeOpacity={0.8}>
                  <Ionicons name="cloud-upload-outline" size={13} color={Brand.blue} />
                  <Text style={f.uploadBtnText}>Upload photo</Text>
                </TouchableOpacity>
                <Text style={f.avatarHint}>JPG, PNG or WEBP. Max 4 MB.</Text>
              </View>
            </View>

            <View style={f.divider} />

            <Field label="Full name">
              <TextInput
                style={inputStyle('fullName')}
                value={profile.fullName}
                onChangeText={v => setProfile(p => ({ ...p, fullName: v }))}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                placeholderTextColor={Brand.bg5}
              />
            </Field>

            <Field label="Email">
              <TextInput
                style={inputStyle('email')}
                value={profile.email}
                onChangeText={v => setProfile(p => ({ ...p, email: v }))}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholderTextColor={Brand.bg5}
              />
            </Field>

            <Field label="Organization">
              <TextInput
                style={inputStyle('org')}
                value={profile.organization}
                onChangeText={v => setProfile(p => ({ ...p, organization: v }))}
                onFocus={() => setFocusedField('org')}
                onBlur={() => setFocusedField(null)}
                placeholderTextColor={Brand.bg5}
              />
            </Field>

            <Field label="Role">
              <View style={f.rolePill}>
                <Text style={f.rolePillText}>{profile.role}</Text>
              </View>
            </Field>

            <View style={f.divider} />

            <View style={f.actionRow}>
              <TouchableOpacity
                style={f.btnPrimary}
                onPress={() => showToast('Profile saved.')}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark" size={14} color="white" />
                <Text style={f.btnPrimaryText}>Save changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={f.btnGhost}
                onPress={() => { setProfile(PROFILE_DEFAULTS); showToast('Profile reset.') }}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh-outline" size={14} color={Brand.navy} />
                <Text style={f.btnGhostText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Security tab ── */}
        {activeTab === 'security' && (
          <View style={{ gap: 12 }}>

            {/* Security card */}
            <View style={f.card}>
              <Text style={f.cardTitle}>Account security</Text>
              <Text style={f.cardSub}>Protect your verifier account.</Text>

              <View style={{ gap: 8, marginTop: 16 }}>
                <SecurityRow
                  icon="shield-checkmark-outline"
                  title="Two-factor authentication"
                  subtitle={twoFactor ? 'Enabled · updated 3 days ago' : 'Not enabled'}
                  right={
                    <Switch
                      value={twoFactor}
                      onValueChange={setTwoFactor}
                      trackColor={{ false: Brand.bg5, true: Brand.blue }}
                      thumbColor="white"
                    />
                  }
                />

                <TouchableOpacity onPress={() => setPwOpen(v => !v)} activeOpacity={0.8}>
                  <SecurityRow
                    icon="key-outline"
                    title="Password"
                    subtitle="Last changed 45 days ago"
                    right={
                      <Text style={f.changeLink}>
                        {pwOpen ? 'Cancel' : 'Change'}
                      </Text>
                    }
                  />
                </TouchableOpacity>
              </View>

              {pwOpen && (
                <View style={{ marginTop: 12, gap: 12 }}>
                  <Field label="Current password">
                    <TextInput
                      style={inputStyle('pwCurrent')}
                      value={pwCurrent}
                      onChangeText={setPwCurrent}
                      secureTextEntry
                      placeholder="••••••••"
                      placeholderTextColor={Brand.bg5}
                      onFocus={() => setFocusedField('pwCurrent')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </Field>
                  <Field label="New password">
                    <TextInput
                      style={inputStyle('pwNew')}
                      value={pwNew}
                      onChangeText={setPwNew}
                      secureTextEntry
                      placeholder="••••••••"
                      placeholderTextColor={Brand.bg5}
                      onFocus={() => setFocusedField('pwNew')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </Field>
                  <Field label="Confirm new password">
                    <TextInput
                      style={inputStyle('pwConfirm')}
                      value={pwConfirm}
                      onChangeText={setPwConfirm}
                      secureTextEntry
                      placeholder="••••••••"
                      placeholderTextColor={Brand.bg5}
                      onFocus={() => setFocusedField('pwConfirm')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </Field>
                  <TouchableOpacity
                    style={f.btnPrimary}
                    onPress={() => {
                      setPwOpen(false); setPwCurrent(''); setPwNew(''); setPwConfirm('')
                      showToast('Password updated.')
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={f.btnPrimaryText}>Update password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Danger zone */}
            <View style={f.dangerCard}>
              <View style={f.dangerIconBox}>
                <Ionicons name="log-out-outline" size={16} color={Brand.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={f.dangerTitle}>Log out of all devices</Text>
                <Text style={f.dangerSub}>Ends every active session, including this one.</Text>
              </View>
              <TouchableOpacity
                style={f.dangerBtn}
                onPress={() =>
                  Alert.alert(
                    'Log out of all devices?',
                    'This immediately ends every active session.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Log out all', style: 'destructive', onPress: () => showToast('Logged out of all devices.') },
                    ]
                  )
                }
                activeOpacity={0.8}
              >
                <Text style={f.dangerBtnText}>Log out all</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const f = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: Brand.bg2 },
  scroll:         { padding: 20, gap: 16, paddingBottom: 40 },

  header:         { gap: 4 },
  eyebrow:        { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue },
  title:          { fontSize: 26, fontWeight: '800', color: Brand.navy, letterSpacing: -0.5 },
  subtitle:       { fontSize: 13, color: Brand.navy, opacity: 0.5, lineHeight: 20 },

  toast:          { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, backgroundColor: 'rgba(22,163,74,0.08)', borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)' },
  toastText:      { fontSize: 13, fontWeight: '600', color: Brand.success },

  tabBar:         { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 14, backgroundColor: Brand.bg3, alignSelf: 'flex-start' },
  tabBtn:         { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  tabBtnActive:   { backgroundColor: 'white', shadowColor: Brand.navy, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText:        { fontSize: 13, fontWeight: '600', color: Brand.navy, opacity: 0.45 },
  tabTextActive:  { color: Brand.blue, opacity: 1 },

  card:           { backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: Brand.bg4, padding: 20, gap: 0 },
  cardTitle:      { fontSize: 15, fontWeight: '700', color: Brand.navy, marginBottom: 2 },
  cardSub:        { fontSize: 12, color: Brand.navy, opacity: 0.45, marginBottom: 0 },

  avatarRow:      { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 4 },
  avatar:         { width: 64, height: 64, borderRadius: 32, backgroundColor: Brand.navy, alignItems: 'center', justifyContent: 'center' },
  avatarText:     { fontSize: 22, fontWeight: '800', color: 'white' },
  uploadBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: Brand.lightBlue2, backgroundColor: Brand.lightBlue },
  uploadBtnText:  { fontSize: 12, fontWeight: '600', color: Brand.blue },
  avatarHint:     { fontSize: 11, color: Brand.navy, opacity: 0.35 },

  divider:        { height: 1, backgroundColor: Brand.bg4, marginVertical: 16 },

  fieldWrap:      { marginBottom: 14 },
  fieldLabel:     { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.55, marginBottom: 6 },
  input:          { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },
  inputFocused:   { borderColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },

  rolePill:       { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, backgroundColor: Brand.lightBlue },
  rolePillText:   { fontSize: 12, fontWeight: '700', color: Brand.blue },

  actionRow:      { flexDirection: 'row', gap: 10 },
  btnPrimary:     { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, backgroundColor: Brand.blue },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: 'white' },
  btnGhost:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  btnGhostText:   { fontSize: 13, fontWeight: '600', color: Brand.navy },

  secRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: Brand.bg2, borderWidth: 1, borderColor: Brand.bg4 },
  secIconBox:     { width: 32, height: 32, borderRadius: 8, backgroundColor: 'white', borderWidth: 1, borderColor: Brand.bg4, alignItems: 'center', justifyContent: 'center' },
  secTitle:       { fontSize: 13, fontWeight: '600', color: Brand.navy },
  secSub:         { fontSize: 11, color: Brand.navy, opacity: 0.45, marginTop: 1 },
  changeLink:     { fontSize: 13, fontWeight: '600', color: Brand.blue },

  dangerCard:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: 'rgba(220,38,38,0.05)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)' },
  dangerIconBox:  { width: 34, height: 34, borderRadius: 9, backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', alignItems: 'center', justifyContent: 'center' },
  dangerTitle:    { fontSize: 13, fontWeight: '600', color: Brand.danger },
  dangerSub:      { fontSize: 11, color: Brand.danger, opacity: 0.65, marginTop: 1 },
  dangerBtn:      { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', backgroundColor: 'white' },
  dangerBtnText:  { fontSize: 12, fontWeight: '600', color: Brand.danger },
})
