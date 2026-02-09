import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/HomeScreen'
import { WorkflowScreen } from '../screens/WorkflowScreen'
import { GalleryScreen } from '../screens/GalleryScreen'
import { SettingsScreen } from '../screens/SettingsScreen'

const Tab = createBottomTabNavigator()

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1f1f1f' },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1f1f1f',
          borderTopColor: '#2a2a2a',
        },
        tabBarActiveTintColor: '#fd4444',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.38)',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workflow" component={WorkflowScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}
