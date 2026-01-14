import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NavigationErrorHandler = ({ error, retry, resetError }) => {
  const handleRetry = () => {
    if (resetError) resetError();
    if (retry) retry();
  };

  const getErrorMessage = (error) => {
    if (error?.message?.includes('navigate')) {
      return 'Navigation failed. The screen you\'re trying to reach may not be available.';
    }
    if (error?.message?.includes('route')) {
      return 'Invalid route. The page you\'re looking for doesn\'t exist.';
    }
    if (error?.message?.includes('stack')) {
      return 'Navigation stack error. Please try going back and trying again.';
    }
    return 'A navigation error occurred. Please try again.';
  };

  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🧭</Text>
        <Text style={styles.errorTitle}>Navigation Error</Text>
        <Text style={styles.errorMessage}>
          {getErrorMessage(error)}
        </Text>
        
        {__DEV__ && error && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>{error.toString()}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 350,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  debugContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavigationErrorHandler;