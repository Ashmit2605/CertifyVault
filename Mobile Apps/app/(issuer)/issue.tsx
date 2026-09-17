import { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

// 🔧 Replace with your students API
const mockStudents = [
  { id: '1', name: 'Rahul Sharma' },
  { id: '2', name: 'Priya Patil' },
  { id: '3', name: 'Amit Joshi' },
]

const certTypes: { id: string; label: string; icon: IoniconsName }[] = [
  { id: 'degree', label: 'Degree', icon: 'school-outline' },
  { id: 'diploma', label: 'Diploma', icon: 'ribbon-outline' },
  { id: 'course', label: 'Course', icon: 'book-outline' },
  { id: 'internship', label: 'Internship', icon: 'briefcase-outline' },
  { id: 'achievement', label: 'Achievement', icon: 'trophy-outline' },
]

const pipelineSteps = [
  'Creating certificate...',
  'Generating QR...',
  'Securing document...',
  'Registering credential...',
  'Certificate issued',
]

const alertCount = 4
const userInitials = 'DS'

export default function IssueCertificate() {
  const router = useRouter()
  const [step, setStep] = useState(0) // 0=student, 1=type, 2=details, 3=preview, 4=processing
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null)
  const [certType, setCertType] = useState<string | null>(null)
  const [certName, setCertName] = useState('')
  const [issueDate, setIssueDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  )
  const [pipelineIndex, setPipelineIndex] = useState(-1)
  const [issuedId, setIssuedId] = useState<string | null>(null)

  const filteredStudents = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  )

  const canProceed =
    (step === 0 && selectedStudent) ||
    (step === 1 && certType) ||
    (step === 2 && certName.trim().length > 0) ||
    step === 3

  useEffect(() => {
    if (step !== 4) return
    setPipelineIndex(0)
    const timers: ReturnType<typeof setTimeout>[] = []
    pipelineSteps.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setPipelineIndex(i + 1)
          if (i === pipelineSteps.length - 1) {
            setIssuedId(`CV-2026-${Math.floor(100000 + Math.random() * 899999)}`)
          }
        }, 700 * (i + 1))
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [step])

  const resetFlow = () => {
    setStep(0)
    setSelectedStudent(null)
    setCertType(null)
    setCertName('')
    setPipelineIndex(-1)
    setIssuedId(null)
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header (inline) ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Issue Certificate</Text>
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

      {/* ── Step indicator ── */}
      {step < 4 && (
        <View style={s.stepRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={s.stepDotWrap}>
              <View style={[s.stepDot, i <= step && s.stepDotActive]}>
                {i < step ? (
                  <Ionicons name="checkmark" size={12} color="white" />
                ) : (
                  <Text style={[s.stepDotText, i === step && s.stepDotTextActive]}>{i + 1}</Text>
                )}
              </View>
              {i < 3 && <View style={[s.stepLine, i < step && s.stepLineActive]} />}
            </View>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Step 0 — Select Student */}
        {step === 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Select Student</Text>
            <View style={s.searchWrap}>
              <Ionicons name="search-outline" size={16} color={Brand.navy} style={{ opacity: 0.4 }} />
              <TextInput
                value={studentSearch}
                onChangeText={setStudentSearch}
                placeholder="Search student"
                placeholderTextColor={Brand.bg5}
                style={s.searchInput}
              />
            </View>
            <View style={{ gap: 8, marginTop: 12 }}>
              {filteredStudents.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  onPress={() => setSelectedStudent(student)}
                  style={[s.studentRow, selectedStudent?.id === student.id && s.studentRowActive]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      s.studentName,
                      selectedStudent?.id === student.id && s.studentNameActive,
                    ]}
                  >
                    {student.name}
                  </Text>
                  {selectedStudent?.id === student.id && (
                    <Ionicons name="checkmark-circle" size={18} color={Brand.blue} />
                  )}
                </TouchableOpacity>
              ))}
              {filteredStudents.length === 0 && (
                <Text style={s.emptyText}>No students found.</Text>
              )}
            </View>
          </View>
        )}

        {/* Step 1 — Certificate Type */}
        {step === 1 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Certificate Type</Text>
            <View style={{ gap: 8, marginTop: 12 }}>
              {certTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setCertType(type.id)}
                  style={[s.typeRow, certType === type.id && s.typeRowActive]}
                  activeOpacity={0.7}
                >
                  <View style={s.typeLeft}>
                    <Ionicons
                      name={type.icon}
                      size={18}
                      color={certType === type.id ? Brand.blue : Brand.navy}
                      style={{ opacity: certType === type.id ? 1 : 0.5 }}
                    />
                    <Text style={[s.typeLabel, certType === type.id && s.typeLabelActive]}>
                      {type.label}
                    </Text>
                  </View>
                  <View style={[s.radio, certType === type.id && s.radioActive]}>
                    {certType === type.id && <View style={s.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2 — Certificate Details */}
        {step === 2 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Certificate Details</Text>
            <View style={{ marginTop: 12 }}>
              <Text style={s.fieldLabel}>Certificate Name</Text>
              <TextInput
                value={certName}
                onChangeText={setCertName}
                placeholder="e.g. B.Tech Computer Engineering"
                placeholderTextColor={Brand.bg5}
                style={s.fieldInput}
              />
            </View>
            <View style={{ marginTop: 14 }}>
              <Text style={s.fieldLabel}>Issue Date</Text>
              <TextInput
                value={issueDate}
                onChangeText={setIssueDate}
                style={s.fieldInput}
              />
            </View>
          </View>
        )}

        {/* Step 3 — Preview */}
        {step === 3 && selectedStudent && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Preview</Text>
            <View style={s.previewCard}>
              <Text style={s.previewCollege}>PCCOER</Text>
              <View style={s.previewDivider} />
              <Text style={s.previewLabel}>CERTIFICATE</Text>
              <Text style={s.previewName}>{selectedStudent.name}</Text>
              <Text style={s.previewCertName}>{certName}</Text>
              <View style={s.previewQr}>
                <Ionicons name="qr-code" size={28} color="white" />
              </View>
              <Text style={s.previewDate}>{issueDate}</Text>
            </View>

            <TouchableOpacity
              style={s.issueBtn}
              onPress={() => setStep(4)}
              activeOpacity={0.85}
            >
              <Ionicons name="shield-checkmark-outline" size={16} color="white" />
              <Text style={s.issueBtnText}>Issue Certificate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4 — Processing / Success */}
        {step === 4 && (
          <View style={s.card}>
            {!issuedId ? (
              <View style={{ gap: 14 }}>
                {pipelineSteps.map((label, i) => {
                  const done = pipelineIndex > i
                  const active = pipelineIndex === i
                  return (
                    <View key={label} style={s.pipelineRow}>
                      {done ? (
                        <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                      ) : active ? (
                        <ActivityIndicator size="small" color={Brand.blue} />
                      ) : (
                        <View style={s.pipelineDotIdle} />
                      )}
                      <Text style={[s.pipelineText, (done || active) && s.pipelineTextActive]}>
                        {label}
                      </Text>
                    </View>
                  )
                })}
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 8 }}>
                <View style={s.successIcon}>
                  <Ionicons name="checkmark" size={28} color="white" />
                </View>
                <Text style={s.successTitle}>Certificate Issued</Text>
                <Text style={s.successId}>{issuedId}</Text>

                <View style={s.successActions}>
                  <TouchableOpacity
                    style={s.successBtnOutline}
                    onPress={() => router.push('/(issuer)/certificates')}
                    activeOpacity={0.8}
                  >
                    <Text style={s.successBtnOutlineText}>View Certificates</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.successBtn} onPress={resetFlow} activeOpacity={0.85}>
                    <Text style={s.successBtnText}>Issue Another</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── Bottom nav buttons ── */}
      {step < 3 && (
        <View style={s.bottomBar}>
          {step > 0 && (
            <TouchableOpacity style={s.backBtn} onPress={() => setStep((s2) => s2 - 1)} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={16} color={Brand.navy} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[s.nextBtn, !canProceed && s.nextBtnDisabled]}
            onPress={() => canProceed && setStep((s2) => s2 + 1)}
            disabled={!canProceed}
            activeOpacity={0.85}
          >
            <Text style={s.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe:                { flex: 1, backgroundColor: Brand.bg },

  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  headerTitle:         { fontSize: 20, fontWeight: '800', color: Brand.navy },
  headerRight:         { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn:             { position: 'relative' },
  badge:               { position: 'absolute', top: -4, right: -4, backgroundColor: Brand.blue, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText:           { fontSize: 9, fontWeight: '700', color: 'white' },
  avatar:              { width: 32, height: 32, borderRadius: 16, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  avatarText:          { fontSize: 12, fontWeight: '700', color: Brand.blue },

  stepRow:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  stepDotWrap:         { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepDot:             { width: 26, height: 26, borderRadius: 13, backgroundColor: Brand.lightBlue, alignItems: 'center', justifyContent: 'center' },
  stepDotActive:       { backgroundColor: Brand.blue },
  stepDotText:         { fontSize: 11, fontWeight: '700', color: Brand.blue, opacity: 0.5 },
  stepDotTextActive:   { color: 'white', opacity: 1 },
  stepLine:            { flex: 1, height: 2, backgroundColor: Brand.bg4, marginHorizontal: 4 },
  stepLineActive:      { backgroundColor: Brand.blue },

  scroll:              { paddingHorizontal: 20, paddingBottom: 30 },
  card:                { backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: Brand.bg4, padding: 16 },
  cardTitle:           { fontSize: 15, fontWeight: '700', color: Brand.navy },

  searchWrap:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 14, backgroundColor: Brand.lightBlue },
  searchInput:         { flex: 1, fontSize: 14, color: Brand.navy },

  studentRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4 },
  studentRowActive:    { borderColor: Brand.blue, backgroundColor: Brand.lightBlue },
  studentName:         { fontSize: 14, fontWeight: '600', color: Brand.navy },
  studentNameActive:   { color: Brand.blue },
  emptyText:           { fontSize: 13, color: Brand.navy, opacity: 0.4, textAlign: 'center', paddingVertical: 20 },

  typeRow:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4 },
  typeRowActive:       { borderColor: Brand.blue, backgroundColor: Brand.lightBlue },
  typeLeft:            { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeLabel:           { fontSize: 14, fontWeight: '600', color: Brand.navy, opacity: 0.7 },
  typeLabelActive:     { color: Brand.blue, opacity: 1 },
  radio:               { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Brand.bg5, alignItems: 'center', justifyContent: 'center' },
  radioActive:         { borderColor: Brand.blue },
  radioDot:            { width: 9, height: 9, borderRadius: 5, backgroundColor: Brand.blue },

  fieldLabel:          { fontSize: 12, fontWeight: '600', color: Brand.navy, opacity: 0.6, marginBottom: 6 },
  fieldInput:          { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4, fontSize: 14, color: Brand.navy, backgroundColor: 'white' },

  previewCard:         { alignItems: 'center', backgroundColor: Brand.navy, borderRadius: 16, padding: 24, marginTop: 12, gap: 4 },
  previewCollege:      { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, color: 'rgba(255,255,255,0.6)' },
  previewDivider:      { width: 40, height: 2, backgroundColor: Brand.blue, marginVertical: 8, borderRadius: 1 },
  previewLabel:        { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: Brand.blue4 },
  previewName:         { fontSize: 18, fontWeight: '800', color: 'white', marginTop: 6 },
  previewCertName:     { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, textAlign: 'center' },
  previewQr:           { width: 48, height: 48, borderRadius: 10, backgroundColor: Brand.blue, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  previewDate:         { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 10 },

  issueBtn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Brand.blue, borderRadius: 14, paddingVertical: 14, marginTop: 16 },
  issueBtnText:        { fontSize: 14, fontWeight: '700', color: 'white' },

  pipelineRow:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pipelineDotIdle:     { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Brand.bg4 },
  pipelineText:        { fontSize: 13, color: Brand.navy, opacity: 0.4 },
  pipelineTextActive:  { opacity: 1, fontWeight: '600' },

  successIcon:         { width: 56, height: 56, borderRadius: 28, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successTitle:        { fontSize: 17, fontWeight: '800', color: Brand.navy },
  successId:           { fontSize: 13, color: Brand.navy, opacity: 0.5, marginTop: 2 },
  successActions:      { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  successBtnOutline:   { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: Brand.blue, alignItems: 'center' },
  successBtnOutlineText:{ fontSize: 13, fontWeight: '700', color: Brand.blue },
  successBtn:          { flex: 1, paddingVertical: 12, borderRadius: 14, backgroundColor: Brand.blue, alignItems: 'center' },
  successBtnText:      { fontSize: 13, fontWeight: '700', color: 'white' },

  bottomBar:           { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: Brand.bg4, backgroundColor: 'white' },
  nextBtn:             { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Brand.blue, borderRadius: 14, paddingVertical: 15 },
  backBtn:             { width: 52, height: 52, borderRadius: 14, borderWidth: 1, borderColor: Brand.bg4, alignItems: 'center', justifyContent: 'center' },
  nextBtnDisabled:     { backgroundColor: Brand.bg5 },
  nextBtnText:         { fontSize: 14, fontWeight: '700', color: 'white' },
})