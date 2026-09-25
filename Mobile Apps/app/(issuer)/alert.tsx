import { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type Severity = 'high' | 'attention' | 'info'
type Category = 'Fraud' | 'Certificate' | 'Verification' | 'Security' | 'System'

interface AlertItem {
  id: string
  severity: Severity
  category: Category
  title: string
  description: string
  time: string
}

// 🔧 Replace with your notifications API
const mockAlerts: AlertItem[] = [
  { id: '1', severity: 'high', category: 'Fraud', title: 'High Risk', description: 'Suspicious certificate detected', time: '2 min ago' },
  { id: '2', severity: 'attention', category: 'Verification', title: 'Attention', description: 'Certificate verification failed', time: '15 min ago' },
  { id: '3', severity: 'info', category: 'Certificate', title: 'Information', description: 'Bulk issuance completed', time: '1 hour ago' },
]

const severityColor: Record<Severity, string> = {
  high: '#DC2626',
  attention: '#D97706',
  info: Brand.blue,
}

const categories: Category[] = ['Fraud', 'Certificate', 'Verification', 'Security', 'System']

export default function Alerts() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')

  const filtered = useMemo(
    () => (activeCategory === 'all' ? mockAlerts : mockAlerts.filter((a) => a.category === activeCategory)),
    [activeCategory]
  )

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={s.headerTitle}>Alerts</Text>
          {mockAlerts.length > 0 && (
            <View style={s.countBadge}>
              <Text style={s.countBadgeText}>{mockAlerts.length}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 20 }} />
      </View>

      <View style={s.categoryRow}>
        <TouchableOpacity
          onPress={() => setActiveCategory('all')}
          style={[s.categoryChip, activeCategory === 'all' && s.categoryChipActive]}
        >
          <Text style={[s.categoryChipText, activeCategory === 'all' && s.categoryChipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[s.categoryChip, activeCategory === cat && s.categoryChipActive]}
          >
            <Text style={[s.categoryChipText, activeCategory === cat && s.categoryChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardTop}>
              <View style={[s.dot, { backgroundColor: severityColor[item.severity] }]} />
              <Text style={s.cardTitle}>{item.title}</Text>
            </View>
            <Text style={s.cardDesc}>{item.description}</Text>
            <Text style={s.cardTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={s.emptyText}>No alerts in this category.</Text>}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:                 { flex: 1, backgroundColor: Brand.bg },
  header:               { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backBtn:              { width: 20 },
  titleRow:             { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle:          { fontSize: 16, fontWeight: '700', color: Brand.navy },
  countBadge:           { backgroundColor: Brand.blue, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  countBadgeText:       { fontSize: 11, fontWeight: '700', color: 'white' },

  categoryRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  categoryChip:         { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Brand.lightBlue },
  categoryChipActive:   { backgroundColor: Brand.blue },
  categoryChipText:     { fontSize: 12, fontWeight: '600', color: Brand.blue },
  categoryChipTextActive: { color: 'white' },

  list:                 { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  card:                 { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: Brand.bg4, padding: 14 },
  cardTop:              { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot:                  { width: 8, height: 8, borderRadius: 4 },
  cardTitle:            { fontSize: 13, fontWeight: '700', color: Brand.navy },
  cardDesc:             { fontSize: 13, color: Brand.navy, opacity: 0.7, marginTop: 4 },
  cardTime:             { fontSize: 11, color: Brand.navy, opacity: 0.35, marginTop: 6 },

  emptyText:            { textAlign: 'center', color: Brand.navy, opacity: 0.4, marginTop: 40, fontSize: 13 },
})