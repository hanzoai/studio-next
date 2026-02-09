import { create } from 'zustand'
import type { QueueItem, QueueState } from '../types/queue'

export interface QueueStoreState {
  /** All queue items */
  items: QueueItem[]
  /** Summary counts */
  state: QueueState
  /** Auto-queue mode */
  autoQueue: boolean

  // Actions
  setItems: (items: QueueItem[]) => void
  addItem: (item: QueueItem) => void
  updateItem: (id: string, update: Partial<QueueItem>) => void
  removeItem: (id: string) => void
  clearCompleted: () => void
  setAutoQueue: (enabled: boolean) => void
}

function computeState(items: QueueItem[]): QueueState {
  return {
    pending: items.filter((i) => i.status === 'pending').length,
    running: items.filter((i) => i.status === 'running').length,
    completed: items.filter((i) => i.status === 'completed').length,
    failed: items.filter((i) => i.status === 'failed').length,
  }
}

export const useQueueStore = create<QueueStoreState>()((set) => ({
  items: [],
  state: { pending: 0, running: 0, completed: 0, failed: 0 },
  autoQueue: false,

  setItems: (items) => set({ items, state: computeState(items) }),

  addItem: (item) =>
    set((s) => {
      const items = [...s.items, item]
      return { items, state: computeState(items) }
    }),

  updateItem: (id, update) =>
    set((s) => {
      const items = s.items.map((i) => (i.id === id ? { ...i, ...update } : i))
      return { items, state: computeState(items) }
    }),

  removeItem: (id) =>
    set((s) => {
      const items = s.items.filter((i) => i.id !== id)
      return { items, state: computeState(items) }
    }),

  clearCompleted: () =>
    set((s) => {
      const items = s.items.filter(
        (i) => i.status !== 'completed' && i.status !== 'failed'
      )
      return { items, state: computeState(items) }
    }),

  setAutoQueue: (enabled) => set({ autoQueue: enabled }),
}))
