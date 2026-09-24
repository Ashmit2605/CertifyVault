import { useEffect, useRef, useState } from 'react'
import {
  View, Text, TextInput, TextInputProps, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Easing, KeyboardAvoidingView, Platform, ActivityIndicator, useWindowDimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Brand } from '@/constants/theme'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']
type Role = 'issuer' | 'holder' | 'verifier'

/* ─── Same roles as the website ─────────────────────────── */
const roles: { id: Role; icon: IoniconsName; label: string; sub: string; desc: string }[] = [
  { id: 'issuer',   icon: 'business-outline', label: 'Issuer',   sub: 'University / Institution', desc: 'Issue and manage academic certificates at scale.' },
  { id: 'holder',   icon: 'school-outline',   label: 'Holder',   sub: 'Student / Graduate',       desc: 'Store and share your verified credentials securely.' },
  { id: 'verifier', icon: 'search-outline',   label: 'Verifier', sub: 'Employer / Organization',  desc: 'Verify credentials instantly with fraud detection.' },
]

// TODO: adjust to your real dashboard routes
const dashboardRoute: Record<Role, string> = {
  issuer:   '/(issuer)/dashboard',
  holder:   '/(holder)',
  verifier: '/(verifier)',
}

/* ─── Input field (icon + label + focus ring + error) ───── */
function Field({
  label, icon, error, secure, ...props
}: { label: string; icon: IoniconsName; error?: string; secure?: boolean } & TextInputProps) {
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(true)

  return (
    <View style={{ flex: 1 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, focused && s.inputFocused, !!error && s.inputError]}>
        <Ionicons name={icon} size={16} color={Brand.navy} style={{ opacity: 0.35 }} />
        <TextInput
          {...props}
          secureTextEntry={secure && hidden}
          placeholderTextColor="rgba(13,27,42,0.3)"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={s.input}
        />
        {secure && (
          <TouchableOpacity onPress={() => setHidden(v => !v)} hitSlop={10} accessibilityLabel="Toggle password visibility">
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={Brand.navy} style={{ opacity: 0.4 }} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={s.errorText}>{error}</Text>}
    </View>
  )
}

export default function SignUpScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { height: winH } = useWindowDimensions()

  /* form state — same fields as the website */
  const [role, setRole] = useState<Role>('holder')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [institution, setInstitution] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const roleData = roles.find(r => r.id === role)!

  const errors = {
    firstName:   firstName.trim() ? '' : 'Required',
    lastName:    lastName.trim() ? '' : 'Required',
    institution: role !== 'issuer' || institution.trim() ? '' : 'Required',
    email:       /^\S+@\S+\.\S+$/.test(email.trim()) ? '' : 'Enter a valid email',
    password:    password.length >= 8 ? '' : 'Min. 8 characters',
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const handleSubmit = () => {
    setShowErrors(true)
    if (hasErrors || loading) return
    setLoading(true)
    // TODO: connect to real registration API
    setTimeout(() => { setLoading(false); setDone(true) }, 1600)
  }

  /* card grows to fill the screen when the page opens */
  const topH = insets.top + 76
  const fullH = winH - topH
  const grow = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(grow, {
      toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start()
  }, [grow])
  const cardH          = grow.interpolate({ inputRange: [0, 1],   outputRange: [winH * 0.38, fullH] })
  const contentOpacity = grow.interpolate({ inputRange: [0.4, 1], outputRange: [0, 1], extrapolate: 'clamp' })

  return (
    <View style={s.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Top bar */}
        <View style={[s.top, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={10} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={18} color="white" />
          </TouchableOpacity>
          <View style={s.brandRow}>
            <View style={s.brandIcon}>
              <Ionicons name="shield-checkmark" size={14} color="white" />
            </View>
            <Text style={s.brandText}>CertifyVault</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Big card */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View style={[s.card, { height: cardH, maxHeight: '100%' }]}>
            <Animated.View style={{ flex: 1, opacity: contentOpacity }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[s.cardContent, { paddingBottom: insets.bottom + 28 }]}
              >
                {done ? (
                  /* ── Success (same screen) ── */
                  <View style={s.successWrap}>
                    <View style={s.successCircle}>
                      <Ionicons name="checkmark" size={30} color={Brand.success} />
                    </View>
                    <Text style={s.title}>Account created!</Text>
                    <Text style={[s.sub, { textAlign: 'center' }]}>
                      Welcome to CertifyVault. Your {roleData.label.toLowerCase()} account is ready.
                    </Text>

                    <View style={s.successRole}>
                      <View style={s.roleIconBoxSm}>
                        <Ionicons name={roleData.icon} size={16} color={Brand.blue} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.roleLabel}>{roleData.label} Account</Text>
                        <Text style={s.roleSub}>{roleData.sub}</Text>
                      </View>
                      <View style={s.activePill}>
                        <Text style={s.activeText}>Active</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[s.btn, { alignSelf: 'stretch' }]}
                      onPress={() => router.replace(dashboardRoute[role] as any)}
                      activeOpacity={0.85}
                    >
                      <Text style={s.btnText}>Go to Dashboard</Text>
                      <Ionicons name="chevron-forward" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* ── Form: everything in one step ── */
                  <>
                    <Text style={s.title}>Create your account</Text>
                    <Text style={s.sub}>Choose your role and fill in your details.</Text>

                    {/* Role */}
                    <Text style={[s.label, { marginTop: 20 }]}>I am a...</Text>
                    <View style={s.roleRow}>
                      {roles.map(r => {
                        const active = r.id === role
                        return (
                          <TouchableOpacity
                            key={r.id}
                            style={[s.roleChip, active && s.roleChipActive]}
                            onPress={() => setRole(r.id)}
                            activeOpacity={0.85}
                          >
                            <View style={[s.roleIconBox, active && { backgroundColor: Brand.blue }]}>
                              <Ionicons name={r.icon} size={16} color={active ? 'white' : Brand.navy} />
                            </View>
                            <Text style={s.roleChipLabel}>{r.label}</Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                    <Text style={s.roleHint}>
                      <Text style={{ color: Brand.blue, fontWeight: '700' }}>{roleData.sub}</Text>
                      {' — '}{roleData.desc}
                    </Text>

                    {/* Details */}
                    <View style={s.form}>
                      <View style={s.twoCol}>
                        <Field
                          label="First name" icon="person-outline" placeholder="First"
                          value={firstName} onChangeText={setFirstName}
                          autoCapitalize="words" error={showErrors ? errors.firstName : ''}
                        />
                        <Field
                          label="Last name" icon="person-outline" placeholder="Last"
                          value={lastName} onChangeText={setLastName}
                          autoCapitalize="words" error={showErrors ? errors.lastName : ''}
                        />
                      </View>

                      {role === 'issuer' && (
                        <View style={{ flexDirection: 'row' }}>
                          <Field
                            label="Institution name" icon="business-outline" placeholder="ABC University"
                            value={institution} onChangeText={setInstitution}
                            autoCapitalize="words" error={showErrors ? errors.institution : ''}
                          />
                        </View>
                      )}

                      <View style={{ flexDirection: 'row' }}>
                        <Field
                          label="Email address" icon="mail-outline"
                          placeholder={role === 'issuer' ? 'admin@institution.edu' : 'you@email.com'}
                          value={email} onChangeText={setEmail}
                          keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                          error={showErrors ? errors.email : ''}
                        />
                      </View>

                      <View style={{ flexDirection: 'row' }}>
                        <Field
                          label="Password" icon="lock-closed-outline" placeholder="Min. 8 characters" secure
                          value={password} onChangeText={setPassword}
                          autoCapitalize="none" autoCorrect={false}
                          error={showErrors ? errors.password : ''}
                        />
                      </View>
                    </View>

                    <Text style={s.terms}>
                      By creating an account you agree to our{' '}
                      <Text style={s.termsLink}>Terms</Text> and{' '}
                      <Text style={s.termsLink}>Privacy Policy</Text>.
                    </Text>

                    <TouchableOpacity
                      style={[s.btn, loading && s.btnLoading]}
                      onPress={handleSubmit}
                      disabled={loading}
                      activeOpacity={0.85}
                    >
                      {loading ? (
                        <>
                          <ActivityIndicator size="small" color="white" />
                          <Text style={s.btnText}>Creating account...</Text>
                        </>
                      ) : (
                        <>
                          <Text style={s.btnText}>Create Account</Text>
                          <Ionicons name="arrow-forward" size={15} color="white" />
                        </>
                      )}
                    </TouchableOpacity>

                    <Text style={s.signinRow}>
                      Already have an account?{' '}
                      <Text style={s.signinLink} onPress={() => router.replace('/(auth)/sign-in')}>Sign in</Text>
                    </Text>
                  </>
                )}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </View>

      </KeyboardAvoidingView>
    </View>
  )
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: Brand.navy },

  // Top bar
  top:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn:   { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  brandRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { width: 24, height: 24, borderRadius: 7, backgroundColor: Brand.blue, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: 'white', letterSpacing: -0.2 },

  // Card
  card:        { backgroundColor: Brand.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  cardContent: { paddingHorizontal: 24, paddingTop: 28 },
  title:       { fontSize: 24, fontWeight: '800', color: Brand.navy, letterSpacing: -0.4 },
  sub:         { marginTop: 6, fontSize: 13, color: Brand.navy, opacity: 0.5, lineHeight: 20 },

  // Roles
  label:         { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.6, marginBottom: 6 },
  roleRow:       { flexDirection: 'row', gap: 10 },
  roleChip:      { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  roleChipActive:{ borderColor: Brand.blue, backgroundColor: Brand.lightBlue },
  roleIconBox:   { width: 34, height: 34, borderRadius: 10, backgroundColor: Brand.bg2, alignItems: 'center', justifyContent: 'center' },
  roleChipLabel: { fontSize: 13, fontWeight: '700', color: Brand.navy },
  roleHint:      { marginTop: 10, fontSize: 12, color: Brand.navy, opacity: 0.6, lineHeight: 18 },

  // Form
  form:      { marginTop: 20, gap: 14 },
  twoCol:    { flexDirection: 'row', gap: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 48, borderRadius: 16, borderWidth: 1, borderColor: Brand.bg5, backgroundColor: 'white' },
  inputFocused: { borderColor: Brand.blue },
  inputError:   { borderColor: '#DC2626' },
  input:     { flex: 1, fontSize: 14, color: Brand.navy, paddingVertical: 0 },
  errorText: { marginTop: 4, fontSize: 11, color: '#DC2626' },

  // Terms / button / footer
  terms:     { marginTop: 16, fontSize: 12, color: Brand.navy, opacity: 0.5, lineHeight: 18 },
  termsLink: { color: Brand.blue, fontWeight: '700' },
  btn:       { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 16, backgroundColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 4 },
  btnLoading:{ backgroundColor: Brand.blue4, shadowOpacity: 0, elevation: 0 },
  btnText:   { fontSize: 15, fontWeight: '700', color: 'white' },
  signinRow: { marginTop: 18, fontSize: 13, color: Brand.navy, opacity: 0.6, textAlign: 'center' },
  signinLink:{ color: Brand.blue, fontWeight: '700' },

  // Success
  successWrap:   { alignItems: 'center', paddingTop: 16 },
  successCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(22,163,74,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successRole:   { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24, padding: 14, borderRadius: 16, backgroundColor: Brand.lightBlue },
  roleIconBoxSm: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  roleLabel:     { fontSize: 14, fontWeight: '700', color: Brand.navy },
  roleSub:       { fontSize: 12, color: Brand.navy, opacity: 0.5 },
  activePill:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(22,163,74,0.12)' },
  activeText:    { fontSize: 11, fontWeight: '700', color: Brand.success },
})