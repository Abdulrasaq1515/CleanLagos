import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { sendLocationUpdate } from './websocketService';

const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  
  if (data) {
    const { locations } = data;
    const location = locations[0];
    
    if (location) {
      // Send location update via WebSocket
      sendLocationUpdate(
        location.coords.latitude,
        location.coords.longitude
      );
      
      console.log('Background location update sent:', location.coords);
    }
  }
});

export const startBackgroundLocationTracking = async () => {
  try {
    // Request background location permission
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      console.log('Foreground location permission denied');
      return false;
    }
    
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    if (backgroundStatus !== 'granted') {
      console.log('Background location permission denied');
      return false;
    }
    
    // Start tracking
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000, // 1 minute
      distanceInterval: 100, // 100 meters
      foregroundService: {
        notificationTitle: 'CleanLagos',
        notificationBody: 'Tracking your location for task assignment',
        notificationColor: '#2E7D32',
      },
    });
    
    console.log('Background location tracking started');
    return true;
  } catch (error) {
    console.error('Failed to start background location tracking:', error);
    return false;
  }
};

export const stopBackgroundLocationTracking = async () => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Background location tracking stopped');
    }
  } catch (error) {
    console.error('Failed to stop background location tracking:', error);
  }
};

export const isBackgroundLocationEnabled = async () => {
  return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
};