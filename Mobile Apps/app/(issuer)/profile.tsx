import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

// 🔧 Replace with your auth/user API
const profileData = {
  name: 'Siddhi Sharma',
  role: 'Certificate Officer',
  institution: 'PCCOER',
  email: 'admin@pccoer.edu',
  phone: '+91 XXXXX XXXXX',
}

const actions: { icon: IoniconsName; label: string; route?: string; danger?: boolean }[] = [
  { icon: 'create-outline', label: 'Edit Profile', route: '/(issuer)/profile-edit' },
  { icon: 'key-outline', label: 'Change Password', route: '/(issuer)/change-password' },
  { icon: 'shield-checkmark-outline', label: 'Security', route: '/(issuer)/security' },
  { icon: 'log-out-outline', label: 'Logout', danger: true },
]

export default function Profile() {
  const router = useRouter()

  const handleLogout = () => {
    // 🔧 Clear auth/session here
    router.replace('/(auth)/sign-in')
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Profile</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={s.content}>
        <View style={s.profileCard}>
          <View style={s.avatarBox}>
            <Ionicons name="person" size={32} color={Brand.blue} />
          </View>
          <Text style={s.name}>{profileData.name}</Text>
          <Text style={s.role}>{profileData.role}</Text>
          <Text style={s.institution}>{profileData.institution}</Text>

          <View style={s.divider} />

          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Email</Text>
            <Text style={s.infoVal}>{profileData.email}</Text>
          </View>
          <View style={[s.infoRow, { marginTop: 10 }]}>
            <Text style={s.infoLabel}>Phone</Text>
            <Text style={s.infoVal}>{profileData.phone}</Text>
          </View>
        </View>

        <View style={s.actionsCard}>
          {actions.map((action, i) => (
            <TouchableOpacity
              key={action.label}
              style={[s.actionRow, i < actions.length - 1 && s.actionRowBorder]}
              onPress={() => (action.danger ? handleLogout() : action.route && router.push(action.route as any))}
              activeOpacity={0.7}
            >
              <View style={s.actionLeft}>
                <Ionicons
                  name={action.icon}
                  size={18}
                  color={action.danger ? '#DC2626' : Brand.blue}
                />
                <Text style={[s.actionLabel, action.danger && s.actionLabelDanger]}>
                  {action.label}
                </Text>
              </View>
              {!action.danger && (
                <Ionicons name="chevron-forward" size={16} color={Brand.navy} style={{ opacity: 0.3 }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: Brand.bg },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn:           { width: 20 },
  headerTitle:       { fontSize: 16, fontWeight: '700', color: Brand.navy },
  content:           { paddingHorizontal: 20, gap: 16 },

  profileCard:       { backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: Brand.bg4, padding: 20, alignItems: 'center' },
  avatarBox:         { width: 72, height: 72, borderRadius: 36, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name:              { fontSize: 17, fontWeight: '800', color: Brand.navy },
  role:              { fontSize: 13, color: Brand.navy, opacity: 0.55, marginTop: 2 },
  institution:       { fontSize: 12, fontWeight: '700', color: Brand.blue, marginTop: 4 },
  divider:           { width: '100%', height: 1, backgroundColor: Brand.bg4, marginVertical: 16 },
  infoRow:           { width: '100%', flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel:         { fontSize: 12, color: Brand.navy, opacity: 0.5 },
  infoVal:           { fontSize: 13, fontWeight: '600', color: Brand.navy },

  actionsCard:       { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, overflow: 'hidden' },
  actionRow:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  actionRowBorder:   { borderBottomWidth: 1, borderBottomColor: Brand.bg4 },
  actionLeft:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionLabel:       { fontSize: 14, fontWeight: '600', color: Brand.navy },
  actionLabelDanger: { color: '#DC2626' },
})