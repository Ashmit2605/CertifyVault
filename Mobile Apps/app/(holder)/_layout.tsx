import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const tabs: { name: string; title: string; icon: IconName; active: IconName }[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', active: 'home' },
  { name: 'certificates', title: 'Certificates', icon: 'ribbon-outline', active: 'ribbon' },
  { name: 'verification', title: 'Verify', icon: 'scan-outline', active: 'scan' },
  { name: 'share', title: 'Share', icon: 'share-social-outline', active: 'share-social' },
  { name: 'activity', title: 'Activity', icon: 'pulse-outline', active: 'pulse' },
  { name: 'profile', title: 'Profile', icon: 'person-outline', active: 'person' },
]

export default function HolderLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Brand.blue, tabBarInactiveTintColor: Brand.navy, tabBarStyle: { backgroundColor: 'white', borderTopColor: Brand.bg4, height: 64, paddingBottom: 10, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 10, fontWeight: '600' } }}>
      {tabs.map(tab => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title, tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? tab.active : tab.icon} size={21} color={color} /> }} />
      ))}
    </Tabs>
  )
}