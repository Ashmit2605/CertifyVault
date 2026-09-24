import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'


type Stage = 'form' | 'sent'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function ForgotPassword() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('form')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const backToSignIn = () => {
    // 🔧 Adjust if your sign-in route differs from /(auth)/sign-in
    router.back()
  }

  const handleSendReset = async () => {
    setError(null)
    if (!email.trim()) {
      setError('Enter your email address.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    // 🔧 Call POST /api/auth/forgot-password with { email } here.
    // Keep the success state generic (don't reveal whether the email exists)
    // to avoid leaking which addresses are registered.
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    setStage('sent')
  }

  if (stage === 'sent') {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity onPress={backToSignIn} style={s.backRow}>
            <Ionicons name="arrow-back" size={18} color={Brand.navy} />
            <Text style={s.backText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={s.centerContent}>
          <View style={s.iconCircle}>
            <Ionicons name="checkmark-circle-outline" size={36} color={Brand.blue} />
          </View>

          <Text style={s.title}>Check Your Email</Text>
          <Text style={s.subtitle}>
            Reset instructions have been sent to{'\n'}
            <Text style={s.emailHighlight}>{email}</Text>
          </Text>

          <View style={s.hintBox}>
            <Ionicons name="information-circle-outline" size={16} color={Brand.navy} />
            <Text style={s.hintText}>
              Didn't get it? Check your spam folder, or wait a minute and try again.
            </Text>
          </View>

          <TouchableOpacity style={s.secondaryBtn} onPress={() => setStage('form')}>
            <Text style={s.secondaryBtnText}>Use a Different Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.primaryBtn} onPress={backToSignIn}>
            <Text style={s.primaryBtnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={s.header}>
          <TouchableOpacity onPress={backToSignIn} style={s.backRow}>
            <Ionicons name="arrow-back" size={18} color={Brand.navy} />
            <Text style={s.backText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={s.centerContent}>
          <View style={s.iconCircle}>
            <Ionicons name="mail-outline" size={28} color={Brand.blue} />
          </View>

          <Text style={s.title}>Forgot your password?</Text>
          <Text style={s.subtitle}>
            Enter your registered email address and we'll send you instructions to reset it.
          </Text>

          <View style={s.formBlock}>
            <Text style={s.label}>Email address</Text>
            <View style={[s.inputRow, error && s.inputRowError]}>
              <Ionicons name="mail-outline" size={16} color={Brand.navy} style={{ opacity: 0.6 }} />
              <TextInput
                value={email}
                onChangeText={(v) => { setEmail(v); if (error) setError(null) }}
                placeholder="you@institution.edu"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={s.input}
              />
            </View>
            {error && <Text style={s.errorText}>{error}</Text>}

            <View style={s.hintBox}>
              <Ionicons name="mail-outline" size={16} color={Brand.navy} />
              <Text style={s.hintText}>Use your CertifyVault account email address.</Text>
            </View>

            <TouchableOpacity
              style={[s.primaryBtn, submitting && s.primaryBtnDisabled]}
              onPress={handleSendReset}
              disabled={submitting}
            >
              <Ionicons name="lock-closed-outline" size={16} color="#FFFFFF" />
              <Text style={s.primaryBtnText}>{submitting ? 'Sending…' : 'Send Reset Link'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Brand.bg },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  backText: { color: Brand.navy, fontSize: 14, fontWeight: '600' },

  centerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    color: Brand.navy,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: Brand.navy,
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.65,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: 320,
  },
  emailHighlight: {
    color: Brand.navy,
    fontWeight: '700',
    opacity: 1,
  },

  formBlock: { width: '100%', maxWidth: 360 },

  label: { color: Brand.navy, fontSize: 13, fontWeight: '600', marginBottom: 8 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Brand.bg4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
  },
  inputRowError: { borderColor: '#F43F5E' },
  input: { flex: 1, fontSize: 15, color: Brand.navy, padding: 0 },
  errorText: { color: '#E11D48', fontSize: 12, marginTop: 6 },

  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F7F9FF',
    borderWidth: 1,
    borderColor: Brand.bg4,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  hintText: { flex: 1, color: Brand.navy, fontSize: 12, lineHeight: 17, opacity: 0.7 },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Brand.blue,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 12,
    width: '100%',
    maxWidth: 360,
  },
  secondaryBtnText: { color: Brand.blue, fontSize: 14, fontWeight: '600' },
})