import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

// 🔧 Replace with your auth/user API
const initialProfile = {
  photo: null as string | null,
  fullName: 'Siddhi Sharma',
  designation: 'Certificate Officer',
  email: 'admin@pccoer.edu', // read-only — tied to institutional account
  phone: '+91 XXXXX XXXXX',
}

export default function EditProfile() {
  const router = useRouter()
  const [fullName, setFullName] = useState(initialProfile.fullName)
  const [designation, setDesignation] = useState(initialProfile.designation)
  const [phone, setPhone] = useState(initialProfile.phone)
  const [photo, setPhoto] = useState(initialProfile.photo)
  const [saved, setSaved] = useState(false)

  const handleChangePhoto = () => {
    // 🔧 Wire up expo-image-picker here to select/replace the photo
  }

  const handleSave = () => {
    // 🔧 Call your update-profile API here with { fullName, designation, phone, photo }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.replace('/(issuer)/profile')} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Edit Profile</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {saved && (
          <View style={s.successBanner}>
            <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
            <Text style={s.successBannerText}>Profile updated successfully</Text>
          </View>
        )}

        <View style={s.photoSection}>
          <View style={s.photoBox}>
            {photo ? (
              <Image source={{ uri: photo }} style={s.photoImg} />
            ) : (
              <Ionicons name="person" size={36} color={Brand.blue} />
            )}
          </View>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
            <Text style={s.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Personal Information</Text>

          <View style={s.field}>
            <Text style={s.fieldLabel}>Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={s.fieldInput}
              placeholderTextColor={Brand.bg5}
            />
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>Designation</Text>
            <TextInput
              value={designation}
              onChangeText={setDesignation}
              style={s.fieldInput}
              placeholderTextColor={Brand.bg5}
            />
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>Email Address</Text>
            <View style={[s.fieldInput, s.fieldInputDisabled]}>
              <Text style={s.disabledText}>{initialProfile.email}</Text>
              <Ionicons name="lock-closed-outline" size={14} color={Brand.navy} style={{ opacity: 0.35 }} />
            </View>
            <Text style={s.fieldHint}>Tied to your institutional account — contact admin to change.</Text>
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={s.fieldInput}
              placeholderTextColor={Brand.bg5}
            />
          </View>
        </View>

        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={s.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: Brand.bg },
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn:             { width: 20 },
  headerTitle:         { fontSize: 16, fontWeight: '700', color: Brand.navy },

  scroll:              { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },

  successBanner:       { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#DCFCE7', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  successBannerText:   { fontSize: 13, fontWeight: '600', color: '#16A34A' },

  photoSection:        { alignItems: 'center', gap: 8 },
  photoBox:            { width: 88, height: 88, borderRadius: 44, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photoImg:            { width: '100%', height: '100%' },
  changePhotoText:     { fontSize: 13, fontWeight: '700', color: Brand.blue },

  card:                { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, padding: 16, gap: 14 },
  sectionTitle:        { fontSize: 14, fontWeight: '700', color: Brand.navy, marginBottom: 2 },

  field:               { gap: 6 },
  fieldLabel:          { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.6 },
  fieldInput:          { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },
  fieldInputDisabled:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Brand.bg2 },
  disabledText:        { fontSize: 14, color: Brand.navy, opacity: 0.55 },
  fieldHint:           { fontSize: 11, color: Brand.navy, opacity: 0.4 },

  saveBtn:             { backgroundColor: Brand.blue, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  saveBtnText:         { fontSize: 14, fontWeight: '700', color: 'white' },
})