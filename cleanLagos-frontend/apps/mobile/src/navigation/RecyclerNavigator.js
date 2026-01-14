import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecyclerHomeScreen from '../screens/recycler/HomeScreen';

const Stack = createStackNavigator();

export default function RecyclerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecyclerHome" component={RecyclerHomeScreen} />
    </Stack.Navigator>
  );
}