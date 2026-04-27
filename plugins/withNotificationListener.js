const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withNotificationListener(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    
    if (!mainApplication.service) {
      mainApplication.service = [];
    }
    
    const serviceName = 'com.lesimoes.androidnotificationlistener.RNAndroidNotificationListener';
    
    const serviceExists = mainApplication.service.some(
      (s) => s.$['android:name'] === serviceName
    );
    
    if (!serviceExists) {
      mainApplication.service.push({
        $: {
          'android:name': serviceName,
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
