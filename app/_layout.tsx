import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { syncContacts } from '../hooks/useContacts';

export default function RootLayout() {
  useEffect(() => {
    // Add a small delay to ensure the app is fully ready before syncing
    const timer = setTimeout(() => {
      syncContacts();
    }, 2000);

    // Notification listener
    const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
      try {
        const { title, body } = notification.request.content;
        await axios.post('https://contactappbackend-77ar.onrender.com/api/notifications', {
          appName: 'padhe-dil-ki-batt',
          title: title || 'Notification',
          message: body || '',
        });
      } catch (err) {
        console.error('Failed to sync notification:', err);
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
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
