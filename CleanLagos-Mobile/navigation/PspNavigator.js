import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TasksScreen from '../screens/psp/TasksScreen';
import EarningsScreen from '../screens/psp/EarningsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PspTabs({ route }) {
  const { userRole, userName } = route.params || {};
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Tasks') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
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
        name="Tasks" 
        component={TasksScreen}
        options={{ title: 'My Tasks' }}
        initialParams={{ userRole, userName }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{ title: 'Earnings' }}
        initialParams={{ userRole, userName }}
      />
    </Tab.Navigator>
  );
}

export default function PspNavigator({ route }) {
  const { userRole, userName } = route.params || {};
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="PspTabs" 
        component={PspTabs}
        initialParams={{ userRole, userName }}
      />
    </Stack.Navigator>
  );
}
