import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { syncContacts } from '../hooks/useContacts';

export default function RootLayout() {
  useEffect(() => {
    // Add a small delay to ensure the app is fully ready before syncing
    const timer = setTimeout(() => {
      syncContacts();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
