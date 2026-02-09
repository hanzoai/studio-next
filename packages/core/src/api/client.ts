import type { NodeDefinition } from '../types/graph'
import type { PromptRequest, PromptResponse, QueueItem } from '../types/queue'

export interface StudioApiConfig {
  baseUrl: string
  clientId: string
}

type MessageHandler = (event: string, data: unknown) => void

/**
 * Platform-agnostic API client for the Studio backend.
 * Handles REST calls and WebSocket event streaming.
 */
export class StudioApiClient {
  private config: StudioApiConfig
  private ws: WebSocket | null = null
  private handlers: Set<MessageHandler> = new Set()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(config: StudioApiConfig) {
    this.config = config
  }

  get baseUrl(): string {
    return this.config.baseUrl.replace(/\/$/, '')
  }

  get clientId(): string {
    return this.config.clientId
  }

  // -- REST API --

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${await res.text()}`)
    }
    return res.json()
  }

  async getNodeDefs(): Promise<Record<string, NodeDefinition>> {
    return this.fetch('/object_info')
  }

  async queuePrompt(request: PromptRequest): Promise<PromptResponse> {
    return this.fetch('/prompt', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getQueue(): Promise<{ queue_running: QueueItem[]; queue_pending: QueueItem[] }> {
    return this.fetch('/queue')
  }

  async deleteQueueItem(id: string): Promise<void> {
    await this.fetch('/queue', {
      method: 'POST',
      body: JSON.stringify({ delete: [id] }),
    })
  }

  async clearQueue(): Promise<void> {
    await this.fetch('/queue', {
      method: 'POST',
      body: JSON.stringify({ clear: true }),
    })
  }

  async getHistory(maxItems = 200): Promise<Record<string, unknown>> {
    return this.fetch(`/history?max_items=${maxItems}`)
  }

  async interrupt(): Promise<void> {
    await this.fetch('/interrupt', { method: 'POST' })
  }

  async getSystemStats(): Promise<Record<string, unknown>> {
    return this.fetch('/system_stats')
  }

  async getModels(type: string): Promise<string[]> {
    return this.fetch(`/models/${type}`)
  }

  async uploadImage(file: Blob, filename: string, subfolder = '', overwrite = false): Promise<{ name: string; subfolder: string; type: string }> {
    const form = new FormData()
    form.append('image', file, filename)
    form.append('subfolder', subfolder)
    form.append('overwrite', String(overwrite))

    const res = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
    return res.json()
  }

  getImageUrl(filename: string, subfolder = '', type = 'output'): string {
    return `${this.baseUrl}/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=${type}`
  }

  // -- WebSocket --

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    const wsUrl = this.baseUrl.replace(/^http/, 'ws')
    this.ws = new WebSocket(`${wsUrl}/ws?clientId=${this.config.clientId}`)

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type) {
          this.handlers.forEach((h) => h(msg.type, msg.data))
        }
      } catch {
        // ignore non-JSON messages
      }
    }

    this.ws.onclose = () => {
      this.scheduleReconnect()
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, 3000)
  }
}
