import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { guiPlugin } from '@hanzogui/vite-plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    guiPlugin({
      config: './src/gui.config.ts',
      components: ['@hanzo/gui'],
    }),
  ],
  resolve: {
    alias: {
      '@studio/core': path.resolve(__dirname, '../../packages/core/src'),
      '@studio/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@studio/graph': path.resolve(__dirname, '../../packages/graph/src'),
      // React Native polyfills for web
      'react-native': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
  optimizeDeps: {
    include: ['@hanzo/gui', '@hanzogui/core'],
  },
  server: {
    port: 5180,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
