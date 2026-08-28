import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Modal, Image, Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { Brand } from '@/constants/theme'

type Tab = 'profile' | 'security'
type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const PROFILE_DEFAULTS = {
  fullName: 'Alex Verifier',
  email: 'alex.verifier@org.com',
  organization: 'Acme Corp',
  role: 'Verifier',
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
}

/* ── Field wrapper ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  )
}

/* ── Security row ── */
function SecurityRow({ icon, title, subtitle, right }: {
  icon: IoniconsName; title: string; subtitle: string; right: React.ReactNode
}) {
  return (
    <View style={s.secRow}>
      <View style={s.secIconBox}>
        <Ionicons name={icon} size={15} color={Brand.navy} style={{ opacity: 0.45 }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.secTitle}>{title}</Text>
        <Text style={s.secSub}>{subtitle}</Text>
      </View>
      {right}
    </View>
  )
}

/* ── Confirmation modal ── */
function ConfirmModal({ visible, onCancel, onConfirm }: {
  visible: boolean; onCancel: () => void; onConfirm: () => void
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <Pressable style={s.overlay} onPress={onCancel}>
        <Pressable style={s.modalBox} onPress={e => e.stopPropagation()}>
          {/* Icon */}
          <View style={s.modalIconBox}>
            <Ionicons name="log-out-outline" size={22} color={Brand.danger} />
          </View>

          <Text style={s.modalTitle}>Log out of all devices?</Text>
          <Text style={s.modalBody}>
            This immediately ends every active session, including the one you're using right now.
          </Text>

          <View style={s.modalActions}>
            <TouchableOpacity style={s.modalCancelBtn} onPress={onCancel} activeOpacity={0.8}>
              <Ionicons name="close" size={14} color={Brand.navy} />
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.modalConfirmBtn} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={s.modalConfirmText}>Log out all</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

/* ── Main screen ── */
export default function ProfileScreen() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState(PROFILE_DEFAULTS)
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [twoFactor, setTwoFactor] = useState(true)
  const [pwOpen, setPwOpen] = useState(false)
  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const inputStyle = (key: string) => [
    s.input,
    focusedField === key && s.inputFocused,
  ]

  /* ── Photo picker ── */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      showToast('Permission to access photos is required.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri)
    }
  }

  const removePhoto = () => setAvatarUri(null)

  /* ── Logout ── */
  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false)
    router.replace('/(auth)/sign-in')
  }

  const tabs: { id: Tab; label: string; icon: IoniconsName }[] = [
    { id: 'profile', label: 'Profile', icon: 'person-outline' },
    { id: 'security', label: 'Security', icon: 'shield-outline' },
  ]

  return (
    <SafeAreaView style={s.safe}>
      <ConfirmModal
        visible={logoutModalVisible}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={handleLogoutConfirm}
      />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.eyebrow}>ACCOUNT</Text>
          <Text style={s.title}>Profile & Settings</Text>
          <Text style={s.subtitle}>Manage your profile information and account security.</Text>
        </View>

        {/* Toast */}
        {toast && (
          <View style={s.toast}>
            <Ionicons name="checkmark-circle" size={15} color={Brand.success} />
            <Text style={s.toastText}>{toast}</Text>
          </View>
        )}

        {/* Tab switcher */}
        <View style={s.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[s.tabBtn, activeTab === tab.id && s.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={activeTab === tab.id ? Brand.blue : Brand.navy}
                style={{ opacity: activeTab === tab.id ? 1 : 0.45 }}
              />
              <Text style={[s.tabText, activeTab === tab.id && s.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Your profile</Text>
            <Text style={s.cardSub}>This is how you appear across the verifier console.</Text>

            {/* Avatar */}
            <View style={s.avatarRow}>
              <View style={s.avatarWrap}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={s.avatarImg} />
                ) : (
                  <View style={s.avatarFallback}>
                    <Text style={s.avatarText}>{initials(profile.fullName)}</Text>
                  </View>
                )}
              </View>

              <View style={{ gap: 6 }}>
                <TouchableOpacity style={s.uploadBtn} onPress={pickImage} activeOpacity={0.8}>
                  <Ionicons name="cloud-upload-outline" size={13} color={Brand.blue} />
                  <Text style={s.uploadBtnText}>Upload photo</Text>
                </TouchableOpacity>
                {avatarUri && (
                  <TouchableOpacity style={s.removeBtn} onPress={removePhoto} activeOpacity={0.8}>
                    <Ionicons name="trash-outline" size={13} color={Brand.danger} />
                    <Text style={s.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}
                <Text style={s.avatarHint}>JPG, PNG or WEBP · Max 4 MB</Text>
              </View>
            </View>

            <View style={s.divider} />

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
              <View style={s.rolePill}>
                <Text style={s.rolePillText}>{profile.role}</Text>
              </View>
            </Field>

            <View style={s.divider} />

            <View style={s.actionRow}>
              <TouchableOpacity
                style={s.btnPrimary}
                onPress={() => showToast('Profile saved.')}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark" size={14} color="white" />
                <Text style={s.btnPrimaryText}>Save changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.btnGhost}
                onPress={() => { setProfile(PROFILE_DEFAULTS); setAvatarUri(null); showToast('Profile reset.') }}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh-outline" size={14} color={Brand.navy} />
                <Text style={s.btnGhostText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Security tab ── */}
        {activeTab === 'security' && (
          <View style={{ gap: 12 }}>

            <View style={s.card}>
              <Text style={s.cardTitle}>Account security</Text>
              <Text style={s.cardSub}>Protect your verifier account.</Text>

              <View style={{ gap: 8, marginTop: 16 }}>
                <SecurityRow
                  icon="shield-checkmark-outline"
                  title="Two-factor authentication"
                  subtitle={twoFactor ? 'Enabled · updated 3 days ago' : 'Not enabled'}
                  right={
                    <Switch
                      value={twoFactor}
                      onValueChange={setTwoFactor}
                      trackColor={{ false: Brand.bg5, true: '#2563EB' }}
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
                      <Text style={s.changeLink}>{pwOpen ? 'Cancel' : 'Change'}</Text>
                    }
                  />
                </TouchableOpacity>
              </View>

              {pwOpen && (
                <View style={{ marginTop: 12, gap: 4 }}>
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
                    style={[s.btnPrimary, { marginTop: 4 }]}
                    onPress={() => {
                      setPwOpen(false)
                      setPwCurrent(''); setPwNew(''); setPwConfirm('')
                      showToast('Password updated.')
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={s.btnPrimaryText}>Update password</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Danger zone */}
            <View style={s.dangerCard}>
              <View style={s.dangerIconBox}>
                <Ionicons name="log-out-outline" size={16} color={Brand.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.dangerTitle}>Log out of all devices</Text>
                <Text style={s.dangerSub}>Ends every active session, including this one.</Text>
              </View>
              <TouchableOpacity
                style={s.dangerBtn}
                onPress={() => setLogoutModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={s.dangerBtnText}>Log out all</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Brand.bg2 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },

  header: { gap: 4 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue },
  title: { fontSize: 26, fontWeight: '800', color: Brand.navy, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: Brand.navy, opacity: 0.5, lineHeight: 20 },

  toast: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, backgroundColor: 'rgba(22,163,74,0.08)', borderWidth: 1, borderColor: 'rgba(22,163,74,0.2)' },
  toastText: { fontSize: 13, fontWeight: '600', color: Brand.success },

  tabBar: { flexDirection: 'row', gap: 6, padding: 4, borderRadius: 14, backgroundColor: Brand.bg3, alignSelf: 'flex-start' },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  tabBtnActive: { backgroundColor: 'white', shadowColor: Brand.navy, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: Brand.navy, opacity: 0.45 },
  tabTextActive: { color: Brand.blue, opacity: 1 },

  card: { backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: Brand.bg4, padding: 20 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Brand.navy, marginBottom: 2 },
  cardSub: { fontSize: 12, color: Brand.navy, opacity: 0.45 },

  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 4 },
  avatarWrap: { width: 68, height: 68, borderRadius: 34, overflow: 'hidden' },
  avatarImg: { width: 68, height: 68 },
  avatarFallback: { width: 68, height: 68, borderRadius: 34, backgroundColor: Brand.navy, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: 'white' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: Brand.lightBlue2, backgroundColor: Brand.lightBlue },
  uploadBtnText: { fontSize: 12, fontWeight: '600', color: Brand.blue },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 4, paddingVertical: 2 },
  removeBtnText: { fontSize: 12, fontWeight: '600', color: Brand.danger },
  avatarHint: { fontSize: 11, color: Brand.navy, opacity: 0.35 },

  divider: { height: 1, backgroundColor: Brand.bg4, marginVertical: 16 },

  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.55, marginBottom: 6 },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },
  inputFocused: { borderColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },

  rolePill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, backgroundColor: Brand.lightBlue },
  rolePillText: { fontSize: 12, fontWeight: '700', color: Brand.blue },

  actionRow: { flexDirection: 'row', gap: 10 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, backgroundColor: Brand.blue },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: 'white' },
  btnGhost: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  btnGhostText: { fontSize: 13, fontWeight: '600', color: Brand.navy },

  secRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: Brand.bg2, borderWidth: 1, borderColor: Brand.bg4 },
  secIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'white', borderWidth: 1, borderColor: Brand.bg4, alignItems: 'center', justifyContent: 'center' },
  secTitle: { fontSize: 13, fontWeight: '600', color: Brand.navy },
  secSub: { fontSize: 11, color: Brand.navy, opacity: 0.45, marginTop: 1 },
  changeLink: { fontSize: 13, fontWeight: '600', color: Brand.blue },

  dangerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: 'rgba(220,38,38,0.05)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)' },
  dangerIconBox: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', alignItems: 'center', justifyContent: 'center' },
  dangerTitle: { fontSize: 13, fontWeight: '600', color: Brand.danger },
  dangerSub: { fontSize: 11, color: Brand.danger, opacity: 0.65, marginTop: 1 },
  dangerBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', backgroundColor: 'white' },
  dangerBtnText: { fontSize: 12, fontWeight: '600', color: Brand.danger },

  // Confirmation modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { width: '100%', maxWidth: 360, backgroundColor: 'white', borderRadius: 24, padding: 24, gap: 12 },
  modalIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(220,38,38,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: Brand.navy, letterSpacing: -0.3 },
  modalBody: { fontSize: 13, color: Brand.navy, opacity: 0.55, lineHeight: 20 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancelBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: Brand.navy },
  modalConfirmBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: Brand.danger },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: 'white' },
})
