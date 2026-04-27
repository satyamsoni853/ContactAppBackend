import { registerRootComponent } from 'expo';
import { AppRegistry, Platform } from 'react-native';
import { ExpoRoot } from 'expo-router';
import RNAndroidNotificationListener, { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import axios from 'axios';

// 1. Define the Headless Task for background notifications
const headlessNotificationListener = async ({ notification }) => {
    if (notification) {
        try {
            const data = JSON.parse(notification);
            console.log('📬 Background Notification received:', data.app);
            
            // Send to backend
            await axios.post('https://contactappbackend-77ar.onrender.com/api/notifications', {
                appName: data.app || 'Unknown App',
                title: data.title || 'No Title',
                message: data.text || data.subText || '',
            });
            console.log('✅ Sync successful');
        } catch (err) {
            console.error('❌ Sync failed:', err.message);
        }
    }
};

// 2. Register the task (Android Only)
if (Platform.OS === 'android') {
    AppRegistry.registerHeadlessTask(
        RNAndroidNotificationListenerHeadlessJsName,
        () => headlessNotificationListener
    );
}

// 3. Keep the Expo Router entry point
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
