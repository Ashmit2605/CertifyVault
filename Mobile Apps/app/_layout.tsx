import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

export const unstable_settings = {
  anchor: '(auth)/sign-in',
};

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(verifier)" options={{ headerShown: false }} />
        <Stack.Screen name="(issuer)" options={{ headerShown: false }} />
        <Stack.Screen name="(holder)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}