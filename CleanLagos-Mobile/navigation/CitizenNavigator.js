import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/citizen/HomeScreen';
import ReportScreen from '../screens/citizen/ReportScreen';
import RewardsScreen from '../screens/citizen/RewardsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CitizenTabs({ route }) {
  const { userRole, userName } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Rewards') {
            iconName = focused ? 'gift' : 'gift-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
        initialParams={{ userRole, userName }}
      />
      <Tab.Screen 
        name="Report" 
        component={ReportScreen}
        options={{ title: 'Report Waste' }}
        initialParams={{ userRole, userName }}
      />
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen}
        options={{ title: 'Rewards' }}
        initialParams={{ userRole, userName }}
      />
    </Tab.Navigator>
  );
}

export default function CitizenNavigator({ route }) {
  const { userRole, userName } = route.params || {};
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="CitizenTabs" 
        component={CitizenTabs}
        initialParams={{ userRole, userName }}
      />
    </Stack.Navigator>
  );
}
