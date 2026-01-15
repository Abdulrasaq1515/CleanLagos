import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyPhoneScreen from '../screens/VerifyPhoneScreen';
import CitizenNavigator from './CitizenNavigator';
import PspNavigator from './PspNavigator';
import RecyclerNavigator from './RecyclerNavigator';

const Stack = createStackNavigator();

// Role-based navigator mapping
const RoleNavigators = {
  citizen: CitizenNavigator,
  psp: PspNavigator,
  recycler: RecyclerNavigator,
  lawma_admin: () => {
    const dispatch = useDispatch();
    
    const handleLogout = () => {
      dispatch({ type: 'auth/logout' });
    };
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 40 }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>🏢</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10, textAlign: 'center' }}>
          Admin Dashboard
        </Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 }}>
          Admin features are available on the web dashboard. Please use a computer to access admin functions.
        </Text>
        <TouchableOpacity 
          onPress={handleLogout}
          style={{ 
            backgroundColor: '#d32f2f', 
            paddingHorizontal: 30, 
            paddingVertical: 12, 
            borderRadius: 8,
            marginTop: 20
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  },
};

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (token && !user) {
          console.log('🔄 Restoring user session...');
          // Could dispatch fetchCurrentUser here if you have that action
        }
      } catch (error) {
        console.log('❌ Failed to restore session:', error.message);
      } finally {
        setInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch, token, user]);

  const getRoleNavigator = (userRole) => {
    const validRoles = ['citizen', 'psp', 'recycler', 'lawma_admin'];
    
    if (!userRole || !validRoles.includes(userRole)) {
      console.warn(`⚠️ Invalid user role: ${userRole}`);
      dispatch({ type: 'auth/logout' });
      return null;
    }
    
    const Navigator = RoleNavigators[userRole];
    if (!Navigator) {
      console.warn(`⚠️ No navigator found for role: ${userRole}`);
      return RoleNavigators.citizen;
    }
    
    console.log(`✅ Loading navigator for role: ${userRole}`);
    return Navigator;
  };

  if (initializing || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 }}>🌿 CleanLagos</Text>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          {initializing ? 'Initializing...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ animationTypeForReplace: 'pop' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
            />
            <Stack.Screen 
              name="VerifyPhone" 
              component={VerifyPhoneScreen}
            />
          </>
        ) : (
          (() => {
            const userRole = user?.role;
            console.log('👤 Authenticated user role:', userRole);
            
            if (!userRole) {
              console.warn('⚠️ User has no role, logging out');
              dispatch({ type: 'auth/logout' });
              return <Stack.Screen name="Login" component={LoginScreen} />;
            }
            
            const Navigator = getRoleNavigator(userRole);
            
            if (!Navigator) {
              return <Stack.Screen name="Login" component={LoginScreen} />;
            }
            
            const screenName = `${userRole.charAt(0).toUpperCase() + userRole.slice(1)}App`;
            
            return (
              <Stack.Screen 
                name={screenName} 
                component={Navigator}
                options={{ animationTypeForReplace: 'push' }}
                initialParams={{ userRole, userName: user?.fullName }}
              />
            );
          })()
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
