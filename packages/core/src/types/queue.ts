/** Queue item status */
export type QueueItemStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

/** A single item in the execution queue */
export interface QueueItem {
  id: string
  number: number
  workflow: unknown // Workflow JSON
  status: QueueItemStatus
  createdAt: number
  startedAt?: number
  completedAt?: number
  error?: string
  outputs?: Record<string, unknown>
}

/** Queue state summary */
export interface QueueState {
  pending: number
  running: number
  completed: number
  failed: number
}

/** Prompt request sent to the server */
export interface PromptRequest {
  client_id: string
  prompt: Record<string, unknown>
  extra_data?: {
    extra_pnginfo?: Record<string, unknown>
  }
}

/** Prompt response from the server */
export interface PromptResponse {
  prompt_id: string
  number: number
  node_errors?: Record<string, { errors: Array<{ type: string; message: string }> }>
}
