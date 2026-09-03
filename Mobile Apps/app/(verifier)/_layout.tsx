import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Brand } from '@/constants/theme'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

const tabs: { name: string; label: string; icon: IoniconsName; activeIcon: IoniconsName }[] = [
  { name: 'index',   label: 'Dashboard', icon: 'grid-outline',          activeIcon: 'grid'            },
  { name: 'verify',  label: 'Verify',    icon: 'scan-outline',          activeIcon: 'scan'            },
  { name: 'history', label: 'History',   icon: 'time-outline',          activeIcon: 'time'            },
  { name: 'saved',   label: 'Saved',     icon: 'bookmark-outline',      activeIcon: 'bookmark'        },
  { name: 'reports', label: 'Reports',   icon: 'document-text-outline', activeIcon: 'document-text'   },
  { name: 'profile', label: 'Profile',   icon: 'person-outline',        activeIcon: 'person'          },
]

export default function VerifierLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.blue,
        tabBarInactiveTintColor: Brand.navy,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: Brand.bg4,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      {tabs.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? tab.activeIcon : tab.icon} size={22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
