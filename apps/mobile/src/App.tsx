import React from 'react'
import { GuiProvider } from '@hanzo/gui'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { config } from '@studio/ui/gui.config'
import { AppNavigator } from './navigation/AppNavigator'

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <GuiProvider config={config} defaultTheme="dark">
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </GuiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
