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

      // (Temporarily disabled listener logic for debugging)
    };

    prepareApp();

    // 2. Setup Notification Listener (Intercept all phone notifications)
    // if (Platform.OS === 'android') {
    //   ... (disabled)
    // }

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

