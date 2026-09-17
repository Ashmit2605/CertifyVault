import { useState, useMemo } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type CertStatus = 'active' | 'pending' | 'revoked'

interface Certificate {
  id: string
  studentName: string
  type: string
  status: CertStatus
  issueDate: string
}

// 🔧 Replace with your API call
const mockCertificates: Certificate[] = [
  { id: 'CV-2026-001245', studentName: 'Rahul Sharma', type: 'B.Tech Degree', status: 'active', issueDate: '12 Aug 2026' },
  { id: 'CV-2026-001244', studentName: 'Priya Patil', type: 'Diploma', status: 'active', issueDate: '12 Aug 2026' },
  { id: 'CV-2026-001243', studentName: 'Aditi Rao', type: 'Course Certificate', status: 'pending', issueDate: '10 Aug 2026' },
  { id: 'CV-2026-001240', studentName: 'Vikram Singh', type: 'Internship Certificate', status: 'revoked', issueDate: '05 Aug 2026' },
]

const filters: { label: string; value: 'all' | CertStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Revoked', value: 'revoked' },
]

const statusStyle: Record<CertStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#DCFCE7', text: '#16A34A', label: 'ACTIVE ✓' },
  pending: { bg: '#FEF3C7', text: '#D97706', label: 'PENDING' },
  revoked: { bg: '#FEE2E2', text: '#DC2626', label: 'REVOKED' },
}

// 🔧 Replace with your real alerts count / auth-derived initials
const alertCount = 4
const userInitials = 'DS'

export default function Certificates() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | CertStatus>('all')

  const filtered = useMemo(() => {
    return mockCertificates.filter((c) => {
      const q = search.toLowerCase()
      const matchesSearch =
        c.id.toLowerCase().includes(q) || c.studentName.toLowerCase().includes(q)
      const matchesFilter = filter === 'all' || c.status === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header (inline) ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Certificates</Text>

        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() => router.push('/(issuer)/alert')}
            activeOpacity={0.7}
          >
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

      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={16} color={Brand.navy} style={{ opacity: 0.4 }} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search certificate..."
          placeholderTextColor={Brand.bg5}
          style={s.searchInput}
        />
      </View>

      <View style={s.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={[s.filterChip, filter === f.value && s.filterChipActive]}
          >
            <Text style={[s.filterChipText, filter === f.value && s.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => {
          const status = statusStyle[item.status]
          return (
            <TouchableOpacity
              style={s.card}
              activeOpacity={0.7}
              onPress={() =>
                router.push({ pathname: '/(issuer)/certificate-details', params: { id: item.id } })
              }
            >
              <View style={{ flex: 1 }}>
                <Text style={s.cardId}>{item.id}</Text>
                <Text style={s.cardName}>{item.studentName}</Text>
                <Text style={s.cardType}>{item.type}</Text>
              </View>
              <View style={s.cardRight}>
                <View style={[s.statusPill, { backgroundColor: status.bg }]}>
                  <Text style={[s.statusText, { color: status.text }]}>{status.label}</Text>
                </View>
                <Text style={s.cardDate}>{item.issueDate}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          <Text style={s.emptyText}>No certificates match your search.</Text>
        }
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: Brand.bg },

  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle:         { fontSize: 22, fontWeight: '800', color: Brand.navy },
  headerRight:         { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn:             { position: 'relative' },
  badge:               { position: 'absolute', top: -4, right: -4, backgroundColor: Brand.blue, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText:           { fontSize: 9, fontWeight: '700', color: 'white' },
  avatar:              { width: 32, height: 32, borderRadius: 16, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText:          { fontSize: 12, fontWeight: '700', color: Brand.blue },

  searchWrap:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 14, backgroundColor: 'white', borderWidth: 1, borderColor: Brand.bg4 },
  searchInput:         { flex: 1, fontSize: 14, color: Brand.navy },

  filterRow:           { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  filterChip:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Brand.lightBlue },
  filterChipActive:    { backgroundColor: Brand.blue },
  filterChipText:      { fontSize: 12, fontWeight: '600', color: Brand.blue },
  filterChipTextActive:{ color: 'white' },

  list:                { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  card:                { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 16, borderWidth: 1, borderColor: Brand.bg4, padding: 14 },
  cardId:              { fontSize: 13, fontWeight: '700', color: Brand.navy },
  cardName:            { fontSize: 14, fontWeight: '600', color: Brand.navy, marginTop: 4 },
  cardType:            { fontSize: 12, color: Brand.navy, opacity: 0.5, marginTop: 1 },
  cardRight:           { alignItems: 'flex-end', justifyContent: 'space-between' },
  statusPill:          { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText:          { fontSize: 10, fontWeight: '700' },
  cardDate:            { fontSize: 11, color: Brand.navy, opacity: 0.4, marginTop: 6 },

  emptyText:           { textAlign: 'center', color: Brand.navy, opacity: 0.4, marginTop: 40, fontSize: 13 },
})