import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkErrorHandler = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      
      if (isConnected && !connected) {
        // Just went offline
        setShowOfflineBanner(true);
        Alert.alert(
          'Connection Lost',
          'You are now offline. Some features may not work properly.',
          [{ text: 'OK' }]
        );
      } else if (!isConnected && connected) {
        // Just came back online
        setShowOfflineBanner(false);
        Alert.alert(
          'Connection Restored',
          'You are back online. All features are now available.',
          [{ text: 'OK' }]
        );
      }
      
      setIsConnected(connected);
    });

    return () => unsubscribe();
  }, [isConnected]);

  const handleRetryConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      const connected = state.isConnected && state.isInternetReachable;
      
      if (connected) {
        setShowOfflineBanner(false);
        setIsConnected(true);
        Alert.alert('Success', 'Connection restored!');
      } else {
        Alert.alert('Still Offline', 'Please check your internet connection and try again.');
      }
    } catch (error) {
      console.error('Error checking network status:', error);
      Alert.alert('Error', 'Unable to check network status.');
    }
  };

  return (
    <View style={styles.container}>
      {showOfflineBanner && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 You are offline</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetryConnection}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NetworkErrorHandler;