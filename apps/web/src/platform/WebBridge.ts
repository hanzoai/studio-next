import type { PlatformBridge } from '@studio/core/platform'

/**
 * Web browser implementation of PlatformBridge.
 * Provides minimal browser API wrappers.
 */
export const webBridge: PlatformBridge = {
  terminal: {
    write: () => {},
    resize: () => {},
    onOutput: () => () => {},
  },

  fs: {
    openFolder: async () => {
      // No-op on web
    },
    pickDirectory: async () => {
      if ('showDirectoryPicker' in window) {
        try {
          const handle = await (window as any).showDirectoryPicker()
          return handle.name
        } catch {
          return null
        }
      }
      return null
    },
    pickFile: async (options) => {
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        if (options?.extensions) {
          input.accept = options.extensions.map((e) => `.${e}`).join(',')
        }
        input.onchange = () => {
          resolve(input.files?.[0]?.name ?? null)
        }
        input.oncancel = () => resolve(null)
        input.click()
      })
    },
    getBasePath: async () => '/',
    readFile: async () => new Uint8Array(),
    writeFile: async () => {},
  },

  downloads: {
    start: async (url) => {
      const a = document.createElement('a')
      a.href = url
      a.download = url.split('/').pop() ?? 'download'
      a.click()
    },
    pause: () => {},
    resume: () => {},
    cancel: () => {},
    onProgress: () => () => {},
  },

  system: {
    platform: 'web',
    getVersion: () => '2.0.0-alpha',
    canAccessUrl: async () => true,
    openExternalUrl: async (url) => {
      window.open(url, '_blank')
    },
  },

  clipboard: {
    readText: async () => navigator.clipboard.readText(),
    writeText: async (text) => navigator.clipboard.writeText(text),
    readImage: async () => null,
    writeImage: async () => {},
  },
}
