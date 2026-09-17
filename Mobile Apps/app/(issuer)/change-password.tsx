import { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Requirement {
  label: string
  test: (pw: string) => boolean
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

export default function ChangePassword() {
  const router = useRouter()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const allRequirementsMet = useMemo(
    () => requirements.every((r) => r.test(newPw)),
    [newPw]
  )
  const canSubmit = currentPw.length > 0 && allRequirementsMet && confirmPw.length > 0

  const handleUpdate = () => {
    setError(null)
    if (newPw !== confirmPw) {
      setError('New passwords do not match.')
      return
    }
    // 🔧 Call your change-password API here with { currentPw, newPw }
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      router.back()
    }, 1500)
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push('/(issuer)/profile')} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Change Password</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.subtitle}>Change your account password to keep your account secure.</Text>

        {success && (
          <View style={s.successBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={s.successBannerText}>Password updated successfully</Text>
          </View>
        )}

        {error && (
          <View style={s.errorBanner}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={s.errorBannerText}>{error}</Text>
          </View>
        )}

        <View style={s.card}>
          <View style={s.field}>
            <Text style={s.fieldLabel}>Current Password</Text>
            <TextInput
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry
              style={s.fieldInput}
              placeholderTextColor={Brand.bg5}
            />
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>New Password</Text>
            <View style={s.pwWrap}>
              <TextInput
                value={newPw}
                onChangeText={setNewPw}
                secureTextEntry={!showNew}
                style={[s.fieldInput, { paddingRight: 44 }]}
                placeholderTextColor={Brand.bg5}
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowNew((v) => !v)}>
                <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={16} color={Brand.navy} style={{ opacity: 0.4 }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>Confirm New Password</Text>
            <View style={s.pwWrap}>
              <TextInput
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry={!showConfirm}
                style={[s.fieldInput, { paddingRight: 44 }]}
                placeholderTextColor={Brand.bg5}
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={16} color={Brand.navy} style={{ opacity: 0.4 }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.reqBox}>
            <Text style={s.reqTitle}>Password Requirements</Text>
            {requirements.map((req) => {
              const met = req.test(newPw)
              return (
                <View key={req.label} style={s.reqRow}>
                  <Ionicons
                    name={met ? 'checkmark-circle' : 'ellipse-outline'}
                    size={15}
                    color={met ? '#16A34A' : Brand.bg5}
                  />
                  <Text style={[s.reqText, met && s.reqTextMet]}>{req.label}</Text>
                </View>
              )
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[s.updateBtn, !canSubmit && s.updateBtnDisabled]}
          onPress={handleUpdate}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Text style={s.updateBtnText}>Update Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: Brand.bg },
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  backBtn:             { width: 20 },
  headerTitle:         { fontSize: 16, fontWeight: '700', color: Brand.navy },

  scroll:              { paddingHorizontal: 20, paddingBottom: 40, gap: 14 },
  subtitle:            { fontSize: 13, color: Brand.navy, opacity: 0.5 },

  successBanner:       { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#DCFCE7', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  successBannerText:   { fontSize: 13, fontWeight: '600', color: '#16A34A' },
  errorBanner:         { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEE2E2', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  errorBannerText:     { fontSize: 13, fontWeight: '600', color: '#DC2626' },

  card:                { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, padding: 16, gap: 14 },
  field:               { gap: 6 },
  fieldLabel:          { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.6 },
  fieldInput:          { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },
  pwWrap:              { position: 'relative' },
  eyeBtn:              { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },

  reqBox:              { backgroundColor: Brand.bg2, borderRadius: 14, padding: 14, gap: 8, marginTop: 2 },
  reqTitle:            { fontSize: 12, fontWeight: '700', color: Brand.navy, opacity: 0.6, marginBottom: 2 },
  reqRow:              { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText:             { fontSize: 13, color: Brand.navy, opacity: 0.5 },
  reqTextMet:          { opacity: 1, color: '#16A34A', fontWeight: '600' },

  updateBtn:           { backgroundColor: Brand.blue, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  updateBtnDisabled:   { backgroundColor: Brand.bg5 },
  updateBtnText:       { fontSize: 14, fontWeight: '700', color: 'white' },
})