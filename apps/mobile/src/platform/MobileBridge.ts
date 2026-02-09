import type { PlatformBridge, Platform } from '@studio/core/platform'
import { Platform as RNPlatform } from 'react-native'

const platform: Platform = RNPlatform.OS === 'ios' ? 'ios' : 'android'

/**
 * React Native / Expo implementation of PlatformBridge.
 */
export const mobileBridge: PlatformBridge = {
  terminal: {
    write: () => {},
    resize: () => {},
    onOutput: () => () => {},
  },

  fs: {
    openFolder: async () => {},
    pickDirectory: async () => null,
    pickFile: async () => null,
    getBasePath: async () => {
      // Use Expo FileSystem.documentDirectory at runtime
      return ''
    },
    readFile: async () => new Uint8Array(),
    writeFile: async () => {},
  },

  downloads: {
    start: async () => {},
    pause: () => {},
    resume: () => {},
    cancel: () => {},
    onProgress: () => () => {},
  },

  system: {
    platform,
    getVersion: () => '2.0.0-alpha',
    canAccessUrl: async () => true,
    openExternalUrl: async () => {},
  },

  clipboard: {
    readText: async () => '',
    writeText: async () => {},
    readImage: async () => null,
    writeImage: async () => {},
  },
}
