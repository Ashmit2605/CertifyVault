import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type Category = 'Fraud' | 'Certificate' | 'Verification' | 'Security' | 'System'
type AlertStatus = 'Investigation' | 'Resolved'
type Tab = 'High Risk' | 'Medium Risk' | 'Low Risk' | AlertStatus

interface AlertFlag {
  level: 'warn' | 'critical'
  text: string
}

interface AlertItem {
  id: string
  risk: number
  status: AlertStatus
  category: Category
  flags: AlertFlag[]
}

const mockAlerts: AlertItem[] = [
  {
    id: 'CV-2026-00982',
    risk: 21,
    status: 'Investigation',
    category: 'Fraud',
    flags: [
      { level: 'warn', text: 'OCR mismatch' },
      { level: 'critical', text: 'Certificate ID not found' },
      { level: 'critical', text: 'Blockchain hash mismatch' },
      { level: 'warn', text: 'Possible image manipulation' },
    ],
  },
  {
    id: 'CV-2026-00975',
    risk: 78,
    status: 'Investigation',
    category: 'Fraud',
    flags: [
      { level: 'critical', text: 'Blockchain hash mismatch' },
      { level: 'critical', text: 'Issuer signature invalid' },
    ],
  },
  {
    id: 'CV-2026-00963',
    risk: 52,
    status: 'Resolved',
    category: 'Certificate',
    flags: [{ level: 'warn', text: 'OCR mismatch' }],
  },
  {
    id: 'CV-2026-00944',
    risk: 12,
    status: 'Resolved',
    category: 'Security',
    flags: [{ level: 'warn', text: 'Possible image manipulation' }],
  },
]

const tabs: Tab[] = ['High Risk', 'Medium Risk', 'Low Risk', 'Investigation', 'Resolved']
const categories: Category[] = ['Fraud', 'Certificate', 'Verification', 'Security', 'System']

function riskLevel(risk: number): 'High' | 'Medium' | 'Low' {
  if (risk >= 70) return 'High'
  if (risk >= 40) return 'Medium'
  return 'Low'
}

function riskColor(risk: number): string {
  if (risk >= 70) return '#DC2626'
  if (risk >= 40) return '#D97706'
  return Brand.success
}

function flagIcon(text: string): React.ComponentProps<typeof Ionicons>['name'] {
  if (/blockchain/i.test(text)) return 'link-outline'
  if (/ocr/i.test(text)) return 'finger-print-outline'
  if (/image/i.test(text)) return 'image-outline'
  return 'document-text-outline'
}

export default function Alerts() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [activeTab, setActiveTab] = useState<Tab>('High Risk')

  const filtered = useMemo(
    () => mockAlerts.filter((alert) => {
      const matchesCategory = activeCategory === 'all' || alert.category === activeCategory
      const matchesTab = activeTab === 'Investigation' || activeTab === 'Resolved'
        ? alert.status === activeTab
        : riskLevel(alert.risk) === activeTab.split(' ')[0]
      return matchesCategory && matchesTab
    }),
    [activeCategory, activeTab],
  )

  const counts = {
    high: mockAlerts.filter((alert) => riskLevel(alert.risk) === 'High').length,
    medium: mockAlerts.filter((alert) => riskLevel(alert.risk) === 'Medium').length,
    low: mockAlerts.filter((alert) => riskLevel(alert.risk) === 'Low').length,
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={20} color={Brand.navy} />
        </TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={s.headerTitle}>Fraud & Alerts</Text>
          {mockAlerts.length > 0 && (
            <View style={s.countBadge}>
              <Text style={s.countBadgeText}>{mockAlerts.length}</Text>
            </View>
          )}
        </View>
        <View style={s.backBtn} />
      </View>

      <View style={s.summaryRow}>
        {([
          { label: 'High Risk', count: counts.high, color: '#DC2626', icon: 'warning-outline' as const },
          { label: 'Medium Risk', count: counts.medium, color: '#D97706', icon: 'alert-circle-outline' as const },
          { label: 'Low Risk', count: counts.low, color: Brand.success, icon: 'shield-checkmark-outline' as const },
        ]).map((stat) => (
          <View key={stat.label} style={s.summaryCard}>
            <Ionicons name={stat.icon} size={18} color={stat.color} />
            <Text style={s.summaryCount}>{stat.count}</Text>
            <Text style={s.summaryLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabRow}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[s.tab, activeTab === tab && s.tabActive]}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.categoryRow}
      >
        <TouchableOpacity
          onPress={() => setActiveCategory('all')}
          style={[s.categoryChip, activeCategory === 'all' && s.categoryChipActive]}
        >
          <Text style={[s.categoryChipText, activeCategory === 'all' && s.categoryChipTextActive]}>All</Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setActiveCategory(category)}
            style={[s.categoryChip, activeCategory === category && s.categoryChipActive]}
          >
            <Text style={[s.categoryChipText, activeCategory === category && s.categoryChipTextActive]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={s.emptyText}>Nothing here right now.</Text>
        ) : filtered.map((item) => {
          const color = riskColor(item.risk)
          return (
            <View key={item.id} style={s.card}>
              <View style={s.cardTop}>
                <Text style={s.cardTitle}>{item.id}</Text>
                <Text style={s.statusBadge}>{item.status}</Text>
              </View>

              <View style={s.riskHeader}>
                <Text style={s.riskLabel}>Risk Score</Text>
                <Text style={[s.riskValue, { color }]}>{item.risk}/100 · {riskLevel(item.risk)}</Text>
              </View>
              <View style={s.riskTrack}>
                <View style={[s.riskBar, { width: `${item.risk}%`, backgroundColor: color }]} />
              </View>

              <View style={s.flags}>
                {item.flags.map((flag) => (
                  <View key={flag.text} style={s.flagRow}>
                    <Ionicons
                      name={flagIcon(flag.text)}
                      size={15}
                      color={flag.level === 'critical' ? '#DC2626' : '#D97706'}
                    />
                    <Text style={s.flagText}>{flag.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Brand.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  backBtn: { width: 28, alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Brand.navy },
  countBadge: { backgroundColor: Brand.blue, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  countBadgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  summaryRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  summaryCard: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4 },
  summaryCount: { fontSize: 18, fontWeight: '800', color: Brand.navy },
  summaryLabel: { fontSize: 10, fontWeight: '600', color: Brand.navy, opacity: 0.6, textAlign: 'center' },
  tabRow: { gap: 8, paddingHorizontal: 20, paddingBottom: 10 },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: Brand.lightBlue },
  tabActive: { backgroundColor: Brand.blue },
  tabText: { fontSize: 11, fontWeight: '600', color: Brand.blue },
  tabTextActive: { color: 'white' },
  categoryRow: { gap: 8, paddingHorizontal: 20, paddingBottom: 14 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Brand.lightBlue },
  categoryChipActive: { backgroundColor: Brand.navy },
  categoryChipText: { fontSize: 11, fontWeight: '600', color: Brand.blue },
  categoryChipTextActive: { color: 'white' },
  list: { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  card: { backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: Brand.bg4, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: Brand.navy },
  statusBadge: { fontSize: 10, fontWeight: '600', color: Brand.navy, backgroundColor: Brand.lightBlue, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12 },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  riskLabel: { fontSize: 11, fontWeight: '500', color: Brand.navy, opacity: 0.55 },
  riskValue: { fontSize: 11, fontWeight: '700' },
  riskTrack: { height: 6, borderRadius: 4, backgroundColor: Brand.lightBlue, overflow: 'hidden', marginBottom: 12 },
  riskBar: { height: '100%', borderRadius: 4 },
  flags: { gap: 7 },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flagText: { flex: 1, fontSize: 12, color: Brand.navy, opacity: 0.75 },
  emptyText: { textAlign: 'center', color: Brand.navy, opacity: 0.4, marginTop: 40, fontSize: 13 },
})
