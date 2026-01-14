import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

import CitizenNavigator from './CitizenNavigator';
import PspNavigator from './PspNavigator';
import RecyclerNavigator from './RecyclerNavigator';
import NavigationErrorHandler from '../components/NavigationErrorHandler';
import { fetchCurrentUser, selectAuth, logout } from '../store';

const Stack = createStackNavigator();

// Role-based navigator mapping
const RoleNavigators = {
  citizen: CitizenNavigator,
  psp_worker: PspNavigator,
  recycler: RecyclerNavigator,
  lawma_admin: () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 }}>
        🏢 Admin Dashboard
      </Text>
      <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 40 }}>
        Admin features are available on the web dashboard. Please use a computer to access admin functions.
      </Text>
    </View>
  ),
};

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, token } = useSelector(selectAuth);
  const [navigationError, setNavigationError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Initialize app and restore user session
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // If we have a token but no user, try to fetch current user
        if (token && !user) {
          console.log('🔄 Restoring user session...');
          await dispatch(fetchCurrentUser()).unwrap();
        }
      } catch (error) {
        console.log('❌ Failed to restore session:', error.message);
        // Session restoration failed, user will need to login again
      } finally {
        setInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch, token, user]);

  const handleNavigationError = (error) => {
    console.error('Navigation error:', error);
    setNavigationError(error);
  };

  const resetNavigationError = () => {
    setNavigationError(null);
  };

  const getRoleNavigator = (userRole) => {
    // Validate role and provide appropriate navigator
    const validRoles = ['citizen', 'psp_worker', 'recycler', 'lawma_admin'];
    
    if (!userRole || !validRoles.includes(userRole)) {
      console.warn(`⚠️ Invalid user role: ${userRole}, defaulting to citizen`);
      // Log out user with invalid role for security
      dispatch(logout());
      return null;
    }
    
    const Navigator = RoleNavigators[userRole];
    if (!Navigator) {
      console.warn(`⚠️ No navigator found for role: ${userRole}, defaulting to citizen`);
      return RoleNavigators.citizen;
    }
    
    console.log(`✅ Loading navigator for role: ${userRole}`);
    return Navigator;
  };

  // Show loading screen during initialization
  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          {initializing ? 'Initializing CleanLagos...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  // Show navigation error screen if there's an error
  if (navigationError) {
    return (
      <NavigationErrorHandler 
        error={navigationError} 
        resetError={resetNavigationError}
        retry={() => {
          resetNavigationError();
          // Could add additional retry logic here
        }}
      />
    );
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // Log navigation state changes for debugging
        if (__DEV__) {
          const currentRoute = state?.routes?.[state.index];
          console.log('📱 Navigation state changed:', {
            screen: currentRoute?.name,
            params: currentRoute?.params,
            userRole: user?.role,
            isAuthenticated
          });
        }
      }}
      onReady={() => {
        console.log('✅ Navigation container ready');
        console.log('🔐 Auth state:', { isAuthenticated, userRole: user?.role });
      }}
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={{ marginTop: 10, color: '#666' }}>Loading navigation...</Text>
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Authentication Stack - for unauthenticated users
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                animationTypeForReplace: !isAuthenticated ? 'pop' : 'push',
              }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          // Main App Stack - for authenticated users based on role
          (() => {
            try {
              const userRole = user?.role;
              console.log('👤 Authenticated user role:', userRole);
              
              if (!userRole) {
                console.warn('⚠️ User has no role, logging out for security');
                dispatch(logout());
                return <Stack.Screen name="Login" component={LoginScreen} />;
              }
              
              const Navigator = getRoleNavigator(userRole);
              
              if (!Navigator) {
                // Invalid role detected, redirect to login
                return <Stack.Screen name="Login" component={LoginScreen} />;
              }
              
              const screenName = `${userRole.charAt(0).toUpperCase() + userRole.slice(1).replace('_', '')}App`;
              
              return (
                <Stack.Screen 
                  name={screenName} 
                  component={Navigator}
                  options={{
                    animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
                  }}
                  initialParams={{ userRole, userName: user?.fullName }}
                />
              );
            } catch (error) {
              console.error('❌ Navigation error:', error);
              handleNavigationError(error);
              return <Stack.Screen name="Login" component={LoginScreen} />;
            }
          })()
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}