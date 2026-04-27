import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, Linking } from 'react-native';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import { syncContacts } from '../hooks/useContacts';

export default function RootLayout() {
  useEffect(() => {
    // 1. Prepare App and Sync Contacts
    const prepareApp = async () => {
      console.log('📱 Preparing app...');
      try {
        await axios.get('https://contactappbackend-77ar.onrender.com/api/health');
        console.log('🌐 Backend is reachable');
      } catch (err) {
        console.warn('⚠️ Backend unreachable');
      }

      // Initial contacts sync
      setTimeout(() => {
        syncContacts();
      }, 3000);

      // Check Notification Listener Permission (Android Only)
      if (Platform.OS === 'android') {
        try {
          const RNAndroidNotificationListener = require('react-native-android-notification-listener').default;
          const status = await RNAndroidNotificationListener.getPermissionStatus();
          console.log('🛡️ Notification Listener Status:', status);
          
          if (status !== 'authorized') {
            Alert.alert(
              "Permission Required",
              "To sync live notifications, please enable 'Notification Access' for this app in settings.",
              [
                { text: "Later" },
                { text: "Open Settings", onPress: () => RNAndroidNotificationListener.requestPermission() }
              ]
            );
          }
        } catch (e) {
          console.log('⚠️ Notification Listener not available in this environment');
        }
      }
    };



    prepareApp();

    // 2. Setup Notification Listener (Intercept all phone notifications)
    if (Platform.OS === 'android') {
      console.log('🎧 Starting Background Notification Listener...');
      
      // Note: This works even when the app is in background/closed on Android
      // as long as the permission is granted.
      const interval = setInterval(async () => {
        try {
          const status = await RNAndroidNotificationListener.getPermissionStatus();
          if (status === 'authorized') {
            // The library handles the background service automatically.
            // We can also use its event listeners if needed.
          }
        } catch (e) {}
      }, 10000);

      return () => clearInterval(interval);
    }
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

