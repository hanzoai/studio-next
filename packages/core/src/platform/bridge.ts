/**
 * PlatformBridge - abstraction layer for platform-specific APIs.
 *
 * Each platform (web, electron, mobile) provides its own implementation.
 * Business logic in @studio/core should only depend on this interface.
 */

export interface TerminalBridge {
  write(data: string): void
  resize(cols: number, rows: number): void
  onOutput(cb: (data: string) => void): () => void
}

export interface FileSystemBridge {
  openFolder(path: string): Promise<void>
  pickDirectory(): Promise<string | null>
  pickFile(options?: { extensions?: string[] }): Promise<string | null>
  getBasePath(): Promise<string>
  readFile(path: string): Promise<Uint8Array>
  writeFile(path: string, data: Uint8Array): Promise<void>
}

export interface DownloadState {
  url: string
  path: string
  progress: number // 0..1
  speed: number // bytes/sec
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed'
  error?: string
}

export interface DownloadBridge {
  start(url: string, path: string): Promise<void>
  pause(url: string): void
  resume(url: string): void
  cancel(url: string): void
  onProgress(cb: (state: DownloadState) => void): () => void
}

export type Platform = 'web' | 'electron' | 'ios' | 'android'

export interface SystemBridge {
  platform: Platform
  getVersion(): string
  canAccessUrl(url: string): Promise<boolean>
  openExternalUrl(url: string): Promise<void>
}

export interface ClipboardBridge {
  readText(): Promise<string>
  writeText(text: string): Promise<void>
  readImage(): Promise<Uint8Array | null>
  writeImage(data: Uint8Array): Promise<void>
}

export interface PlatformBridge {
  terminal: TerminalBridge
  fs: FileSystemBridge
  downloads: DownloadBridge
  system: SystemBridge
  clipboard: ClipboardBridge
}

// Singleton access - set by each platform's entry point
let _bridge: PlatformBridge | null = null

export function setPlatformBridge(bridge: PlatformBridge): void {
  _bridge = bridge
}

export function getPlatformBridge(): PlatformBridge {
  if (!_bridge) {
    throw new Error(
      'PlatformBridge not initialized. Call setPlatformBridge() in your app entry point.'
    )
  }
  return _bridge
}
