import { create } from 'zustand'
import type { NodeExecutionState } from '../types/graph'

export interface ExecutionState {
  /** Currently executing prompt ID */
  activePromptId: string | null
  /** Execution state per node */
  nodeStates: Map<number, NodeExecutionState>
  /** Overall progress 0..1 */
  progress: number
  /** Whether execution is in progress */
  isExecuting: boolean

  // Actions
  startExecution: (promptId: string) => void
  updateNodeState: (nodeId: number, state: Partial<NodeExecutionState>) => void
  setProgress: (progress: number) => void
  finishExecution: () => void
  clearStates: () => void
}

export const useExecutionStore = create<ExecutionState>()((set) => ({
  activePromptId: null,
  nodeStates: new Map(),
  progress: 0,
  isExecuting: false,

  startExecution: (promptId) =>
    set({
      activePromptId: promptId,
      isExecuting: true,
      progress: 0,
      nodeStates: new Map(),
    }),

  updateNodeState: (nodeId, state) =>
    set((s) => {
      const next = new Map(s.nodeStates)
      const existing = next.get(nodeId) ?? { nodeId, status: 'idle' }
      next.set(nodeId, { ...existing, ...state })
      return { nodeStates: next }
    }),

  setProgress: (progress) => set({ progress }),

  finishExecution: () =>
    set({ activePromptId: null, isExecuting: false, progress: 1 }),

  clearStates: () =>
    set({ nodeStates: new Map(), progress: 0, isExecuting: false }),
}))
