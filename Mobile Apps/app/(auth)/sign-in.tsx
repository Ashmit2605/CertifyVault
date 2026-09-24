import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Brand } from '@/constants/theme'

type Role = 'verifier' | 'issuer' | 'holder'

export default function SignInScreen() {
  const router = useRouter() as any

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [role, setRole] = useState<Role>('verifier')
  const [loading, setLoading] = useState(false)

  const [focusedField, setFocusedField] = useState<
    'email' | 'password' | null
  >(null)

  const [error, setError] = useState('')

  const handleSubmit = () => {
    const normalizedEmail = email.trim()

    // Validation
    if (!normalizedEmail || !password) {
      setError('Enter your email address and password to continue.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      // Role-based navigation
      if (role === 'verifier') {
        router.replace('/(verifier)')
      } else if (role === 'issuer') {
        router.replace('/(issuer)/dashboard')
      } else {
        router.replace('/(holder)')
      }
    }, 1200)
  }

  const inputStyle = (field: 'email' | 'password') => [
    s.input,
    focusedField === field && s.inputFocused,
  ]

  const roles: {
    key: Role
    label: string
    icon: keyof typeof Ionicons.glyphMap
  }[] = [
    {
      key: 'verifier',
      label: 'Verifier',
      icon: 'scan-outline',
    },
    {
      key: 'issuer',
      label: 'Issuer',
      icon: 'business-outline',
    },
    {
      key: 'holder',
      label: 'Holder',
      icon: 'school-outline',
    },
  ]

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.formWrap}>

          <TouchableOpacity
            style={s.backButton}
            onPress={() => router.replace('/(tabs)/home')}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={17} color={Brand.blue} />
            <Text style={s.backButtonText}>Back to Home</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={s.heading}>Welcome back</Text>

          <Text style={s.subheading}>
            Sign in to your CertifyVault account
          </Text>

          {/* Role Selector */}
          <View style={s.roleSwitcher}>
            {roles.map((accountRole) => {
              const isActive = role === accountRole.key

              return (
                <TouchableOpacity
                  key={accountRole.key}
                  onPress={() => {
                    setRole(accountRole.key)
                    setError('')
                  }}
                  style={[
                    s.roleButton,
                    isActive && s.roleButtonActive,
                  ]}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={accountRole.icon}
                    size={15}
                    color={isActive ? 'white' : Brand.navy}
                  />

                  <Text
                    style={[
                      s.roleButtonText,
                      isActive && s.roleButtonTextActive,
                    ]}
                  >
                    {accountRole.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Selected Role Description */}
          <View style={s.roleDescription}>
            <Ionicons
              name={
                role === 'issuer'
                  ? 'business-outline'
                  : role === 'holder'
                  ? 'school-outline'
                  : 'scan-outline'
              }
              size={16}
              color={Brand.blue}
            />

            <Text style={s.roleDescriptionText}>
              {role === 'issuer'
                ? 'Access your institution and certificate issuance dashboard'
                : role === 'holder'
                ? 'Access and manage your verified certificates'
                : 'Verify certificates using QR codes and blockchain records'}
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <View style={s.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={15}
                color="#C0392B"
              />

              <Text style={s.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={s.fieldGroup}>
            <Text style={s.label}>
              Email address
            </Text>

            <TextInput
              style={inputStyle('email')}
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (error) setError('')
              }}
              placeholder="you@institution.edu"
              placeholderTextColor={Brand.bg5}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Password */}
          <View style={s.fieldGroup}>
            <View style={s.labelRow}>
              <Text style={s.label}>
                Password
              </Text>

              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={s.forgotLink}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={s.passwordWrap}>
              <TextInput
                style={[
                  inputStyle('password'),
                  {
                    paddingRight: 48,
                  },
                ]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text)
                  if (error) setError('')
                }}
                placeholder="••••••••"
                placeholderTextColor={Brand.bg5}
                secureTextEntry={!showPw}
                autoCapitalize="none"
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />

              <TouchableOpacity
                style={s.eyeBtn}
                onPress={() => setShowPw((value) => !value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    showPw
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={17}
                  color={Brand.navy}
                  style={{ opacity: 0.4 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In */}
          <TouchableOpacity
            style={[
              s.submitBtn,
              loading && s.submitBtnLoading,
            ]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator
                color="white"
                size="small"
              />
            ) : (
              <>
                <Ionicons
                  name="lock-closed-outline"
                  size={15}
                  color="white"
                />

                <Text style={s.submitText}>
                  Sign In Securely
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />

            <Text style={s.dividerText}>
              or
            </Text>

            <View style={s.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity
            style={s.googleBtn}
            activeOpacity={0.8}
          >
            <Text style={s.googleIcon}>
              G
            </Text>

            <Text style={s.googleText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Signup */}
          <Text style={s.signupText}>
            Don't have an account?{' '}

            <Text style={s.signupLink} onPress={() => router.push('/(auth)/create_one_free')}>
              Create one free
            </Text>
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({

  // --------------------------------------------------
  // Screen
  // --------------------------------------------------

  safe: {
    flex: 1,
    backgroundColor: Brand.bg,
  },

  scroll: {
    flexGrow: 1,
  },

  // --------------------------------------------------
  // Main Form
  // --------------------------------------------------

  formWrap: {
    padding: 28,
    gap: 0,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 28,
  },

  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.blue,
  },

  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: Brand.navy,
    letterSpacing: -0.5,
    marginBottom: 6,
  },

  subheading: {
    fontSize: 13,
    color: Brand.navy,
    opacity: 0.5,
    marginBottom: 24,
  },

  // --------------------------------------------------
  // Role Switcher
  // --------------------------------------------------

  roleSwitcher: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 14,
  },

  roleButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,

    paddingVertical: 11,

    borderRadius: 13,
    borderWidth: 1,
    borderColor: Brand.bg5,

    backgroundColor: 'white',
  },

  roleButtonActive: {
    backgroundColor: Brand.blue,
    borderColor: Brand.blue,

    shadowColor: Brand.blue,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 7,

    elevation: 3,
  },

  roleButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: Brand.navy,
    opacity: 0.65,
  },

  roleButtonTextActive: {
    color: 'white',
    opacity: 1,
  },

  // --------------------------------------------------
  // Role Description
  // --------------------------------------------------

  roleDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderRadius: 12,

    backgroundColor: '#F5F8FF',

    borderWidth: 1,
    borderColor: '#E4ECFF',

    marginBottom: 18,
  },

  roleDescriptionText: {
    flex: 1,

    fontSize: 11,
    lineHeight: 16,

    color: Brand.navy,
    opacity: 0.65,
  },

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,

    backgroundColor: '#FFF4F2',

    borderWidth: 1,
    borderColor: '#F6D4CF',

    borderRadius: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginBottom: 14,
  },

  errorText: {
    flex: 1,

    fontSize: 11,
    fontWeight: '600',

    color: '#C0392B',
  },

  // --------------------------------------------------
  // Fields
  // --------------------------------------------------

  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',

    color: Brand.navy,

    opacity: 0.6,

    marginBottom: 6,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 6,
  },

  forgotLink: {
    fontSize: 11,
    fontWeight: '600',

    color: Brand.blue,
  },

  input: {
    width: '100%',

    paddingHorizontal: 16,
    paddingVertical: 14,

    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: Brand.bg5,

    fontSize: 14,

    color: Brand.navy,

    backgroundColor: 'white',
  },

  inputFocused: {
    borderColor: Brand.blue,

    shadowColor: Brand.blue,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    shadowOpacity: 0.12,
    shadowRadius: 6,

    elevation: 2,
  },

  passwordWrap: {
    position: 'relative',
  },

  eyeBtn: {
    position: 'absolute',

    right: 14,
    top: 0,
    bottom: 0,

    justifyContent: 'center',
  },

  // --------------------------------------------------
  // Submit Button
  // --------------------------------------------------

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 8,

    paddingVertical: 15,

    borderRadius: 16,

    backgroundColor: Brand.blue,

    marginTop: 4,

    shadowColor: Brand.blue,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.28,
    shadowRadius: 12,

    elevation: 4,
  },

  submitBtnLoading: {
    backgroundColor: Brand.blue4,

    shadowOpacity: 0,

    elevation: 0,
  },

  submitText: {
    fontSize: 15,
    fontWeight: '700',

    color: 'white',
  },

  // --------------------------------------------------
  // Divider
  // --------------------------------------------------

  divider: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,

    marginVertical: 20,
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: Brand.bg5,
  },

  dividerText: {
    fontSize: 11,
    fontWeight: '500',

    color: Brand.navy,

    opacity: 0.35,
  },

  // --------------------------------------------------
  // Google
  // --------------------------------------------------

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,

    paddingVertical: 14,

    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: Brand.bg5,

    backgroundColor: 'white',
  },

  googleIcon: {
    fontSize: 15,
    fontWeight: '800',

    color: '#4285F4',
  },

  googleText: {
    fontSize: 14,
    fontWeight: '600',

    color: Brand.navy,
  },

  // --------------------------------------------------
  // Signup
  // --------------------------------------------------

  signupText: {
    textAlign: 'center',

    fontSize: 13,

    color: Brand.navy,

    opacity: 0.5,

    marginTop: 20,
  },

  signupLink: {
    fontWeight: '700',

    color: Brand.blue,

    opacity: 1,
  },
})
