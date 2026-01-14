import { Alert } from 'react-native';

class NetworkHandler {
  constructor() {
    this.isOnline = true;
    this.retryAttempts = 0;
    this.maxRetries = 3;
  }

  // Simulate network connectivity check
  checkConnectivity = async () => {
    try {
      // In a real app, you'd use @react-native-async-storage/async-storage 
      // or @react-native-community/netinfo for actual network checking
      // For now, we'll simulate it
      return Promise.resolve(true);
    } catch (error) {
      console.warn('Network connectivity check failed:', error);
      return false;
    }
  };

  // Handle network errors with retry logic
  handleNetworkError = async (error, operation) => {
    console.warn('Network error occurred:', error);
    
    const isConnected = await this.checkConnectivity();
    
    if (!isConnected) {
      this.showOfflineMessage();
      return { success: false, error: 'No internet connection' };
    }

    // Retry logic for temporary network issues
    if (this.retryAttempts < this.maxRetries) {
      this.retryAttempts++;
      console.log(`Retrying operation... Attempt ${this.retryAttempts}/${this.maxRetries}`);
      
      try {
        // Wait before retry (exponential backoff)
        await this.delay(1000 * this.retryAttempts);
        const result = await operation();
        this.retryAttempts = 0; // Reset on success
        return { success: true, data: result };
      } catch (retryError) {
        if (this.retryAttempts >= this.maxRetries) {
          this.showMaxRetriesMessage();
          this.retryAttempts = 0;
          return { success: false, error: 'Max retries exceeded' };
        }
        return this.handleNetworkError(retryError, operation);
      }
    }

    return { success: false, error: error.message };
  };

  // Show offline message
  showOfflineMessage = () => {
    Alert.alert(
      'No Internet Connection',
      'Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  };

  // Show max retries message
  showMaxRetriesMessage = () => {
    Alert.alert(
      'Connection Problem',
      'Unable to connect after multiple attempts. Please try again later.',
      [{ text: 'OK' }]
    );
  };

  // Utility delay function
  delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Wrapper for network operations
  executeWithRetry = async (operation, errorMessage = 'Network operation failed') => {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      console.error(errorMessage, error);
      return this.handleNetworkError(error, operation);
    }
  };
}

// Export singleton instance
export default new NetworkHandler();