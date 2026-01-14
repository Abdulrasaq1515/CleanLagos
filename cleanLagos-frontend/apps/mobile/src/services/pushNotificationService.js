import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { store } from '../store';
import axios from 'axios';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }
    
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied');
      return null;
    }
    
    // Get FCM token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Register with backend
    const state = store.getState();
    if (state.auth.token) {
      await axios.post(
        `${process.env.API_BASE_URL}/notifications/register-device`,
        {
          token,
          platform: Platform.OS,
        },
        {
          headers: {
            'Authorization': `Bearer ${state.auth.token}`,
          },
        }
      );
    }
    
    // Configure channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E7D32',
      });
    }
    
    return token;
  } catch (error) {
    console.error('Push notification registration error:', error);
    return null;
  }
};

export const setupNotificationListeners = () => {
  // Handle notification received while app is foregrounded
  Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });
  
  // Handle notification tapped
  Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    
    // Navigate based on notification type
    if (data.type === 'report_verified' && data.reportId) {
      // Navigate to report details
    } else if (data.type === 'task_assigned' && data.taskId) {
      // Navigate to task details
    }
  });
};