import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import BrowseScreen from '../screens/recycler/BrowseScreen';
import PickupsScreen from '../screens/recycler/PickupsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RecyclerTabs({ route }) {
  const { userRole, userName } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Pickups') {
            iconName = focused ? 'cube' : 'cube-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9800',
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
        name="Browse" 
        component={BrowseScreen}
        options={{ title: 'Browse' }}
        initialParams={{ userRole, userName }}
      />
      <Tab.Screen 
        name="Pickups" 
        component={PickupsScreen}
        options={{ title: 'My Pickups' }}
        initialParams={{ userRole, userName }}
      />
    </Tab.Navigator>
  );
}

export default function RecyclerNavigator({ route }) {
  const { userRole, userName } = route.params || {};
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="RecyclerTabs" 
        component={RecyclerTabs}
        initialParams={{ userRole, userName }}
      />
    </Stack.Navigator>
  );
}
