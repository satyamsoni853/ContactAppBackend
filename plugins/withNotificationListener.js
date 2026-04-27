const withAndroidManifest = require('@expo/config-plugins').withAndroidManifest;

module.exports = ({ config }) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    // Add the Notification Listener Service
    if (!mainApplication.service) {
      mainApplication.service = [];
    }
    
    const serviceExists = mainApplication.service.some(
      (s) => s.$['android:name'] === 'com.lesimoes.androidnotificationlistener.RNAndroidNotificationListener'
    );
    
    if (!serviceExists) {
      mainApplication.service.push({
        $: {
          'android:name': 'com.lesimoes.androidnotificationlistener.RNAndroidNotificationListener',

          'android:label': 'NotificationService',
          'android:permission': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
          'android:exported': 'true',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name': 'android.service.notification.NotificationListenerService',
                },
              },
            ],
          },
        ],
      });
    }

    return config;
  });
};
