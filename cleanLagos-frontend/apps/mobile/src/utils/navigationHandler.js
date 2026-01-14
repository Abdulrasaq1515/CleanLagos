import { Alert } from 'react-native';

class NavigationHandler {
  constructor() {
    this.navigationHistory = [];
    this.maxHistorySize = 10;
  }

  // Track navigation changes
  trackNavigation = (screen, user = null) => {
    const navigationEntry = {
      screen,
      timestamp: new Date().toISOString(),
      user: user ? { role: user.role, name: user.name } : null
    };

    this.navigationHistory.unshift(navigationEntry);
    
    // Keep history size manageable
    if (this.navigationHistory.length > this.maxHistorySize) {
      this.navigationHistory = this.navigationHistory.slice(0, this.maxHistorySize);
    }

    console.log('Navigation tracked:', navigationEntry);
  };

  // Validate navigation based on user role
  validateNavigation = (targetScreen, user) => {
    if (!user) {
      // Unauthenticated users can access auth-related screens
      const authScreens = ['login', 'register', 'forgotPassword', 'otp', 'resetPassword'];
      if (!authScreens.includes(targetScreen)) {
        this.handleNavigationError('Authentication required', 'login');
        return false;
      }
      return true;
    }

    // Define allowed screens per role
    const allowedScreens = {
      citizen: ['home', 'citizen', 'login'],
      psp: ['home', 'psp', 'login'],
      recycler: ['home', 'recycler', 'login']
    };

    const userAllowedScreens = allowedScreens[user.role] || ['login'];
    
    if (!userAllowedScreens.includes(targetScreen)) {
      this.handleNavigationError(
        `Access denied: ${user.role} users cannot access ${targetScreen}`,
        'home'
      );
      return false;
    }

    return true;
  };

  // Handle navigation errors
  handleNavigationError = (message, fallbackScreen = 'login') => {
    console.error('Navigation error:', message);
    
    Alert.alert(
      'Navigation Error',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            // Return to fallback screen
            console.log(`Redirecting to fallback screen: ${fallbackScreen}`);
          }
        }
      ]
    );

    return fallbackScreen;
  };

  // Safe navigation with error handling
  safeNavigate = (targetScreen, user, setCurrentScreen) => {
    try {
      if (this.validateNavigation(targetScreen, user)) {
        this.trackNavigation(targetScreen, user);
        setCurrentScreen(targetScreen);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Navigation failed:', error);
      const fallbackScreen = this.handleNavigationError(
        'Navigation failed unexpectedly',
        user ? 'home' : 'login'
      );
      setCurrentScreen(fallbackScreen);
      return false;
    }
  };

  // Get navigation history for debugging
  getNavigationHistory = () => {
    return this.navigationHistory;
  };

  // Clear navigation history (useful for logout)
  clearHistory = () => {
    this.navigationHistory = [];
    console.log('Navigation history cleared');
  };
}

// Export singleton instance
export default new NavigationHandler();