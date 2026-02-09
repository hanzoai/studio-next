import React from 'react'
import { TamaguiProvider } from 'tamagui'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import { config } from '@studio/ui/tamagui.config'
import { AppNavigator } from './navigation/AppNavigator'

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme="dark">
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </TamaguiProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
