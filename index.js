import { registerRootComponent } from 'expo';
import { AppRegistry, Platform } from 'react-native';
import { ExpoRoot } from 'expo-router';
import axios from 'axios';

// 1. Define the Headless Task for background notifications
const headlessNotificationListener = async ({ notification }) => {
    if (notification) {
        try {
            const data = JSON.parse(notification);
            console.log('📬 Background Notification received:', data.app);
            
            await axios.post('https://contactappbackend-77ar.onrender.com/api/notifications', {
                appName: data.app || 'Unknown App',
                title: data.title || 'No Title',
                message: data.text || data.subText || '',
            });
        } catch (err) {
            console.error('❌ Sync failed:', err.message);
        }
    }
};

// 2. Register the task (Android Only - Safe Check)
if (Platform.OS === 'android') {
    try {
        const RNAndroidNotificationListener = require('react-native-android-notification-listener').default;
        const { RNAndroidNotificationListenerHeadlessJsName } = require('react-native-android-notification-listener');
        
        AppRegistry.registerHeadlessTask(
            RNAndroidNotificationListenerHeadlessJsName,
            () => headlessNotificationListener
        );
    } catch (e) {
        console.log('⚠️ Notification Listener library not found (Normal for Expo Go)');
    }
}

// 3. Keep the Expo Router entry point
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
