import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'Hanzo Studio',
  slug: 'hanzo-studio',
  scheme: 'hanzo-studio',
  owner: 'hanzo',
  version: '2.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  splash: {
    backgroundColor: '#171717',
  },
  ios: {
    bundleIdentifier: 'ai.hanzo.studio',
    supportsTablet: true,
  },
  android: {
    package: 'ai.hanzo.studio',
    adaptiveIcon: {
      backgroundColor: '#171717',
    },
  },
  plugins: [
    'expo-router',
  ],
  extra: {
    eas: {
      projectId: '', // Set via EAS
    },
  },
}

export default config
