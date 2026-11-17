import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

// 🔧 Replace with your dashboard summary API
const dashboardData = {
  institutionName: 'PCCOER',
  verified: true,
  totalCertificates: 12450,
  issuedCount: null,
  verifiedCount: 8921,
  pendingCount: 143,
  failedRegistrationCount: null,
  revokedCount: null,
  issuedThisMonthCount: null,
}

const stats: {
  label: string
  value: number | null
  icon: IoniconsName
  color: string
  backgroundColor: string
}[] = [
  { label: 'Total certificates', value: dashboardData.totalCertificates, icon: 'document-text-outline', color: Brand.blue, backgroundColor: Brand.lightBlue },
  { label: 'Issued', value: dashboardData.issuedCount, icon: 'shield-checkmark-outline', color: Brand.success, backgroundColor: '#E8F9EF' },
  { label: 'Pending registration', value: dashboardData.pendingCount, icon: 'time-outline', color: '#D97706', backgroundColor: '#FFF6E5' },
  { label: 'Registration failed', value: dashboardData.failedRegistrationCount, icon: 'alert-circle-outline', color: Brand.danger, backgroundColor: '#FDEDEE' },
  { label: 'Revoked', value: dashboardData.revokedCount, icon: 'ban-outline', color: Brand.navy, backgroundColor: Brand.bg4 },
  { label: 'Issued this month', value: dashboardData.issuedThisMonthCount, icon: 'calendar-outline', color: Brand.blue, backgroundColor: Brand.lightBlue },
  { label: 'Verified', value: dashboardData.verifiedCount, icon: 'checkmark-circle-outline', color: Brand.success, backgroundColor: '#E8F9EF' },
]

const quickActions: { icon: IoniconsName; label: string; route: string; tint: string }[] = [
  { icon: 'add-circle-outline', label: 'Issue Certificate', route: '/(issuer)/issue', tint: Brand.blue },
  { icon: 'scan-outline', label: 'Scan & Verify', route: '/(issuer)/verify', tint: Brand.blue },
  { icon: 'notifications-outline', label: 'View Alerts', route: '/(issuer)/alert', tint: Brand.blue },
]

// 🔧 Replace with your recent-activity API
const recentActivity: {
  id: string
  icon: IoniconsName
  tint: string
  title: string
  detail: string
  time: string
}[] = [
  { id: '1', icon: 'checkmark-circle', tint: Brand.success, title: 'Certificate issued', detail: 'Rahul Sharma', time: '2 minutes ago' },
  { id: '2', icon: 'checkmark-circle', tint: Brand.success, title: 'Certificate verified', detail: 'CV-2026-001245', time: '10 minutes ago' },
  { id: '3', icon: 'warning', tint: '#EA580C', title: 'Suspicious certificate', detail: '', time: '15 minutes ago' },
]

const alertCount = 4
const userInitials = 'DS'

export default function IssuerHome() {
  const router = useRouter()

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header (inline) ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>CertifyVault</Text>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/(issuer)/alert')} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={Brand.navy} />
            {alertCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{alertCount > 9 ? '9+' : alertCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(issuer)/profile')} activeOpacity={0.7}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{userInitials}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Greeting card ── */}
        <View style={s.greetCard}>
          <View style={s.greetTop}>
            <Text style={s.greeting}>Good morning, Admin 👋</Text>
          </View>

          <View style={s.institutionRow}>
            <Text style={s.institutionName}>{dashboardData.institutionName}</Text>
            {dashboardData.verified && (
              <View style={s.verifiedPill}>
                <Ionicons name="checkmark-circle" size={12} color={Brand.success} />
                <Text style={s.verifiedPillText}>Institution Verified</Text>
              </View>
            )}
          </View>

        </View>

        {/* ── Certificate statistics ── */}
        <View style={s.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: stat.backgroundColor }]}>
                <Ionicons name={stat.icon} size={19} color={stat.color} />
              </View>
              <Text style={s.statLabel}>{stat.label}</Text>
              <Text style={s.statValue}>{stat.value === null ? '—' : stat.value.toLocaleString()}</Text>
            </View>
          ))}
        </View>
        <Text style={s.statsNote}>Additional issuer totals will appear when mobile statistics are connected.</Text>

        {/* ── Quick Actions ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionsCard}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={action.label}
                style={[s.actionRow, i < quickActions.length - 1 && s.actionRowBorder]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={s.actionLeft}>
                  <Ionicons name={action.icon} size={18} color={action.tint} />
                  <Text style={s.actionLabel}>{action.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Brand.navy} style={{ opacity: 0.3 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Recent Activity ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Recent certificate activity</Text>
          <View style={s.activityCard}>
            {recentActivity.map((item, i) => (
              <View key={item.id} style={[s.activityRow, i < recentActivity.length - 1 && s.activityRowBorder]}>
                <Ionicons name={item.icon} size={16} color={item.tint} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={s.activityTitle}>{item.title}</Text>
                  {item.detail ? <Text style={s.activityDetail}>{item.detail}</Text> : null}
                  <Text style={s.activityTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: Brand.bg },

  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle:        { fontSize: 16, fontWeight: '800', color: Brand.navy },
  headerRight:        { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn:            { position: 'relative' },
  badge:              { position: 'absolute', top: -4, right: -4, backgroundColor: Brand.blue, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText:          { fontSize: 9, fontWeight: '700', color: 'white' },
  avatar:             { width: 32, height: 32, borderRadius: 16, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText:         { fontSize: 12, fontWeight: '700', color: Brand.blue },

  scroll:             { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 20 },

  // Greeting card
  greetCard:          { backgroundColor: Brand.navy, borderRadius: 22, padding: 20, gap: 14 },
  greetTop:           {},
  greeting:           { fontSize: 16, fontWeight: '700', color: 'white' },
  institutionRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  institutionName:    { fontSize: 20, fontWeight: '800', color: 'white' },
  verifiedPill:       { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  verifiedPillText:   { fontSize: 10, fontWeight: '600', color: 'white', opacity: 0.85 },

  statsGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard:           { width: '47%', minHeight: 116, padding: 14, backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: Brand.bg4, gap: 6 },
  statIcon:           { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statLabel:          { fontSize: 11, color: Brand.navy, opacity: 0.55 },
  statValue:          { fontSize: 20, fontWeight: '800', color: Brand.navy },
  statsNote:          { fontSize: 11, lineHeight: 16, color: Brand.navy, opacity: 0.45, marginTop: -14 },

  // Sections
  section:            { gap: 10 },
  sectionTitle:       { fontSize: 15, fontWeight: '700', color: Brand.navy },

  // Quick actions
  actionsCard:        { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, overflow: 'hidden' },
  actionRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  actionRowBorder:    { borderBottomWidth: 1, borderBottomColor: Brand.bg4 },
  actionLeft:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionLabel:        { fontSize: 14, fontWeight: '600', color: Brand.navy },

  // Activity
  activityCard:       { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, overflow: 'hidden' },
  activityRow:        { flexDirection: 'row', gap: 10, paddingVertical: 14, paddingHorizontal: 16 },
  activityRowBorder:  { borderBottomWidth: 1, borderBottomColor: Brand.bg4 },
  activityTitle:      { fontSize: 13, fontWeight: '600', color: Brand.navy },
  activityDetail:     { fontSize: 12, color: Brand.navy, opacity: 0.55, marginTop: 1 },
  activityTime:       { fontSize: 11, color: Brand.navy, opacity: 0.35, marginTop: 2 },
})