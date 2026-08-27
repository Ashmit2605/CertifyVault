import React, { useState, useRef } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Brand } from '@/constants/theme'

const trustSignals = [
  { icon: 'shield-checkmark-outline' as const, label: 'SHA-256 Verified',    color: Brand.success },
  { icon: 'cube-outline'             as const, label: 'Blockchain Anchored',  color: Brand.blue    },
  { icon: 'qr-code-outline'          as const, label: 'QR Authenticated',     color: Brand.blue2   },
  { icon: 'checkmark-circle-outline' as const, label: 'Issuer Confirmed',     color: Brand.success },
]

function LeftPanel() {
  const pulse = useRef(new Animated.Value(1)).current
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,   duration: 1000, useNativeDriver: true }),
      ])
    ).start()
  }, [pulse])

}

export default function SignInScreen() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.replace('/(verifier)')
    }, 1800)
  }

  const inputStyle = (field: 'email' | 'password') => [
    s.input,
    focusedField === field && s.inputFocused,
  ]

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Form */}
        <View style={s.formWrap}>
          <Text style={s.heading}>Welcome back</Text>
          <Text style={s.subheading}>Sign in to your CertifyVault account</Text>

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>Email address</Text>
            <TextInput
              style={inputStyle('email')}
              value={email}
              onChangeText={setEmail}
              placeholder="you@institution.edu"
              placeholderTextColor={Brand.bg5}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <View style={s.labelRow}>
              <Text style={s.label}>Password</Text>
              <TouchableOpacity>
                <Text style={s.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={s.passwordWrap}>
              <TextInput
                style={[inputStyle('password'), { paddingRight: 48 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Brand.bg5}
                secureTextEntry={!showPw}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw(v => !v)}>
                <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={16} color={Brand.navy} style={{ opacity: 0.4 }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnLoading]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="lock-closed-outline" size={15} color="white" />
                <Text style={s.submitText}>Sign In Securely</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Google SSO */}
          <TouchableOpacity style={s.googleBtn} activeOpacity={0.8}>
            <Text style={s.googleIcon}>G</Text>
            <Text style={s.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign up link */}
          <Text style={s.signupText}>
            Don't have an account?{' '}
            <Text style={s.signupLink}>Create one free</Text>
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Brand.bg },
  scroll:          { flexGrow: 1 },

  // Left panel
  leftPanel:       { backgroundColor: Brand.navy, padding: 28, gap: 12 },
  certCard:        { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 },
  certCardHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  certCardBrand:   { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: 'rgba(255,255,255,0.6)' },
  verifiedBadge:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: 'rgba(22,163,74,0.2)' },
  verifiedDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  verifiedText:    { fontSize: 9, fontWeight: '700', color: '#4ADE80' },
  certCardBody:    { padding: 16, gap: 4 },
  certLabel:       { fontSize: 9, fontWeight: '700', letterSpacing: 1.5, color: Brand.blue4, marginBottom: 4 },
  certTitle:       { fontSize: 15, fontWeight: '800', color: 'white' },
  certSub:         { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  certRow:         { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  certRowLabel:    { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.35)' },
  certRowVal:      { fontSize: 10, fontWeight: '700', color: '#4ADE80' },
  trustRow:        { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  trustIconBox:    { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  trustLabel:      { flex: 1, fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  trustDot:        { width: 6, height: 6, borderRadius: 3 },
  tagline:         { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.35)', marginTop: 4 },

  // Form
  formWrap:        { padding: 28, gap: 0 },
  heading:         { fontSize: 28, fontWeight: '800', color: Brand.navy, letterSpacing: -0.5, marginBottom: 6 },
  subheading:      { fontSize: 13, color: Brand.navy, opacity: 0.5, marginBottom: 28 },
  fieldGroup:      { marginBottom: 16 },
  label:           { fontSize: 11, fontWeight: '600', color: Brand.navy, opacity: 0.6, marginBottom: 6 },
  labelRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  forgotLink:      { fontSize: 11, fontWeight: '600', color: Brand.blue },
  input:           { width: '100%', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: Brand.bg5, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },
  inputFocused:    { borderColor: Brand.blue, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  passwordWrap:    { position: 'relative' },
  eyeBtn:          { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  submitBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15, borderRadius: 16, backgroundColor: Brand.blue, marginTop: 8, shadowColor: Brand.blue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 4 },
  submitBtnLoading:{ backgroundColor: Brand.blue4, shadowOpacity: 0, elevation: 0 },
  submitText:      { fontSize: 15, fontWeight: '700', color: 'white' },
  divider:         { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  dividerLine:     { flex: 1, height: 1, backgroundColor: Brand.bg5 },
  dividerText:     { fontSize: 11, fontWeight: '500', color: Brand.navy, opacity: 0.35 },
  googleBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: Brand.bg5, backgroundColor: 'white' },
  googleIcon:      { fontSize: 15, fontWeight: '800', color: '#4285F4' },
  googleText:      { fontSize: 14, fontWeight: '600', color: Brand.navy },
  signupText:      { textAlign: 'center', fontSize: 13, color: Brand.navy, opacity: 0.5, marginTop: 20 },
  signupLink:      { fontWeight: '700', color: Brand.blue, opacity: 1 },
})
