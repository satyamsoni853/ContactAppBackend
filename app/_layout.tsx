import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { syncContacts } from '../hooks/useContacts';

export default function RootLayout() {
  useEffect(() => {
    // 1. Request permissions and check connectivity
    const prepareApp = async () => {
      console.log('📱 Preparing app...');
      
      // Check backend connectivity
      try {
        await axios.get('https://contactappbackend-77ar.onrender.com/api/health');
        console.log('🌐 Backend is reachable');
      } catch (err) {
        console.warn('⚠️ Backend unreachable, sync might fail');
      }

      // Request notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      console.log('🔔 Notification permission status:', finalStatus);

      // Initial contacts sync
      setTimeout(() => {
        syncContacts();
      }, 3000);
    };

    prepareApp();

    // 2. Notification listener
    console.log('🎧 Setting up notification listener...');
    const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('📩 Notification received:', notification.request.content.title);
      try {
        const { title, body } = notification.request.content;
        await axios.post('https://contactappbackend-77ar.onrender.com/api/notifications', {
          appName: 'padhe-dil-ki-batt',
          title: title || 'Notification',
          message: body || '',
        });
        console.log('✅ Notification synced to backend');
      } catch (err: any) {
        console.error('❌ Failed to sync notification:', err.message);
      }
    });

    // 3. Notification response listener (when user taps notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👉 User interacted with notification');
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
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
