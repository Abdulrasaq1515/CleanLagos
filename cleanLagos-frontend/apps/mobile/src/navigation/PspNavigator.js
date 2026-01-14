import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PspHomeScreen from '../screens/psp/HomeScreen';
import TaskDetailScreen from '../screens/psp/TaskDetailScreen';
import CompleteTaskScreen from '../screens/psp/CompleteTaskScreen';

const Stack = createStackNavigator();

export default function PspNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PspHome" component={PspHomeScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CompleteTask" component={CompleteTaskScreen} />
    </Stack.Navigator>
  );
}