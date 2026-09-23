import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Brand } from '@/constants/theme'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const PROFILE_DEFAULTS = {
  name: 'Atharv Sharma',
  email: 'atharv@example.com',
  phone: '+91 98765 43210',
  location: 'Pune, India',
  bio: 'Computer Science Student',
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || '?'
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  )
}

export default function HolderProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState(PROFILE_DEFAULTS)
  const [editing, setEditing] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const inputStyle = (key: string) => [
    s.input,
    focusedField === key && s.inputFocused,
  ]

  const updateField = (key: keyof typeof PROFILE_DEFAULTS, value: string) => {
    setProfile(current => ({ ...current, [key]: value }))
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.eyebrow}>ACCOUNT</Text>
          <Text style={s.title}>Profile & Settings</Text>
          <Text style={s.subtitle}>Manage your profile information and certificate identity.</Text>
        </View>

        {toast && (
          <View style={s.toast}>
            <Ionicons name="checkmark-circle" size={15} color={Brand.success} />
            <Text style={s.toastText}>{toast}</Text>
          </View>
        )}

        <View style={s.card}>
          <View style={s.cardHeader}>
            <View>
              <Text style={s.cardTitle}>Your profile</Text>
              <Text style={s.cardSub}>This is how you appear on your digital certificates.</Text>
            </View>
            {!editing && (
              <TouchableOpacity style={s.editButton} onPress={() => setEditing(true)} activeOpacity={0.8}>
                <Ionicons name="create-outline" size={14} color={Brand.blue} />
                <Text style={s.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={s.avatarRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials(profile.name)}</Text>
            </View>
            <View>
              <Text style={s.avatarName}>{profile.name}</Text>
              <View style={s.rolePill}>
                <Ionicons name="school-outline" size={12} color={Brand.blue} />
                <Text style={s.rolePillText}>Certificate holder</Text>
              </View>
            </View>
          </View>

          <View style={s.divider} />

          {editing ? (
            <View>
              <Field label="Full name">
                <TextInput value={profile.name} onChangeText={value => updateField('name', value)} style={inputStyle('name')} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
              </Field>
              <Field label="Email">
                <TextInput value={profile.email} onChangeText={value => updateField('email', value)} style={inputStyle('email')} keyboardType="email-address" autoCapitalize="none" onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
              </Field>
              <Field label="Phone">
                <TextInput value={profile.phone} onChangeText={value => updateField('phone', value)} style={inputStyle('phone')} keyboardType="phone-pad" onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
              </Field>
              <Field label="Location">
                <TextInput value={profile.location} onChangeText={value => updateField('location', value)} style={inputStyle('location')} onFocus={() => setFocusedField('location')} onBlur={() => setFocusedField(null)} />
              </Field>
              <Field label="Bio">
                <TextInput value={profile.bio} onChangeText={value => updateField('bio', value)} style={[inputStyle('bio'), s.bioInput]} multiline onFocus={() => setFocusedField('bio')} onBlur={() => setFocusedField(null)} />
              </Field>

              <View style={s.divider} />
              <View style={s.actionRow}>
                <TouchableOpacity style={s.btnPrimary} onPress={() => { setEditing(false); showToast('Profile saved.') }} activeOpacity={0.85}>
                  <Ionicons name="checkmark" size={14} color="white" />
                  <Text style={s.btnPrimaryText}>Save changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnGhost} onPress={() => setEditing(false)} activeOpacity={0.8}>
                  <Ionicons name="close" size={14} color={Brand.navy} />
                  <Text style={s.btnGhostText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Detail icon="person-outline" label="Full name" value={profile.name} />
              <Detail icon="mail-outline" label="Email" value={profile.email} />
              <Detail icon="call-outline" label="Phone" value={profile.phone} />
              <Detail icon="location-outline" label="Location" value={profile.location} />
              <Detail icon="document-text-outline" label="Bio" value={profile.bio} last />
            </View>
          )}
        </View>

        <View style={s.dangerCard}>
          <View style={s.dangerIconBox}>
            <Ionicons name="log-out-outline" size={16} color={Brand.danger} />
          </View>
          <View style={s.dangerContent}>
            <Text style={s.dangerTitle}>Log out</Text>
            <Text style={s.dangerSub}>Return to the CertifyVault landing page.</Text>
          </View>
          <TouchableOpacity
            style={s.dangerButton}
            onPress={() => router.replace('/(auth)/sign-in')}
            activeOpacity={0.8}
          >
            <Text style={s.dangerButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Detail({ icon, label, value, last = false }: { icon: IconName; label: string; value: string; last?: boolean }) {
  return (
    <View style={[s.detail, last && s.detailLast]}>
      <View style={s.detailIcon}><Ionicons name={icon} size={15} color={Brand.navy} style={{ opacity: 0.45 }} /></View>
      <View style={s.detailContent}><Text style={s.fieldLabel}>{label}</Text><Text style={s.detailText}>{value}</Text></View>
    </View>
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
  card: { backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: Brand.bg4, padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Brand.navy, marginBottom: 2 },
  cardSub: { fontSize: 12, color: Brand.navy, opacity: 0.45 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: Brand.lightBlue2, backgroundColor: Brand.lightBlue },
  editButtonText: { fontSize: 12, fontWeight: '600', color: Brand.blue },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18, marginBottom: 4 },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: Brand.navy, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: 'white' },
  avatarName: { fontSize: 16, fontWeight: '700', color: Brand.navy, marginBottom: 7 },
  rolePill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: Brand.lightBlue },
  rolePillText: { fontSize: 11, fontWeight: '700', color: Brand.blue },
  divider: { height: 1, backgroundColor: Brand.bg4, marginVertical: 16 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.55, marginBottom: 6 },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },
  inputFocused: { borderColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },
  bioInput: { minHeight: 76, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', gap: 10 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, backgroundColor: Brand.blue },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: 'white' },
  btnGhost: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 11, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  btnGhostText: { fontSize: 13, fontWeight: '600', color: Brand.navy },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Brand.bg4 },
  detailLast: { borderBottomWidth: 0 },
  detailIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: Brand.bg2, borderWidth: 1, borderColor: Brand.bg4, alignItems: 'center', justifyContent: 'center' },
  detailContent: { flex: 1 },
  detailText: { fontSize: 14, color: Brand.navy },
  dangerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: 'rgba(220,38,38,0.05)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.15)' },
  dangerIconBox: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', alignItems: 'center', justifyContent: 'center' },
  dangerContent: { flex: 1 },
  dangerTitle: { fontSize: 13, fontWeight: '600', color: Brand.danger },
  dangerSub: { fontSize: 11, color: Brand.danger, opacity: 0.65, marginTop: 1 },
  dangerButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', backgroundColor: 'white' },
  dangerButtonText: { fontSize: 12, fontWeight: '600', color: Brand.danger },
})
