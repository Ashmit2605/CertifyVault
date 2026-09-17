import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Settings() {
  const router = useRouter()

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={s.content}>
        <View style={s.card}>
          <TouchableOpacity
            style={s.row}
            onPress={() => router.push('/(issuer)/profile')}
            activeOpacity={0.7}
          >
            <View style={s.rowLeft}>
              <View style={[s.iconBox, { backgroundColor: Brand.lightBlue }]}>
                <Ionicons name="person-outline" size={18} color={Brand.blue} />
              </View>
              <Text style={s.rowLabel}>Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Brand.navy} style={{ opacity: 0.3 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.row, s.rowBorder]}
            onPress={() => router.push('/(issuer)/alert')}
            activeOpacity={0.7}
          >
            <View style={s.rowLeft}>
              <View style={[s.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="notifications-outline" size={18} color="#D97706" />
              </View>
              <Text style={s.rowLabel}>Alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Brand.navy} style={{ opacity: 0.3 }} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Brand.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backBtn:     { width: 20 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Brand.navy },
  content:     { paddingHorizontal: 20 },
  card:        { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, overflow: 'hidden' },
  row:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  rowBorder:   { borderTopWidth: 1, borderTopColor: Brand.bg4 },
  rowLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox:     { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rowLabel:    { fontSize: 14, fontWeight: '600', color: Brand.navy },
})