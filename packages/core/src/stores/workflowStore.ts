import { create } from 'zustand'
import type { Workflow } from '../types/graph'

export interface WorkflowStoreState {
  /** Current workflow being edited */
  activeWorkflow: Workflow | null
  /** Workflow filename / path */
  activeWorkflowPath: string | null
  /** Whether the workflow has unsaved changes */
  isDirty: boolean
  /** Undo stack */
  undoStack: Workflow[]
  /** Redo stack */
  redoStack: Workflow[]

  // Actions
  setWorkflow: (workflow: Workflow, path?: string) => void
  updateWorkflow: (workflow: Workflow) => void
  markClean: () => void
  undo: () => void
  redo: () => void
  clear: () => void
}

const MAX_UNDO = 50

export const useWorkflowStore = create<WorkflowStoreState>()((set, get) => ({
  activeWorkflow: null,
  activeWorkflowPath: null,
  isDirty: false,
  undoStack: [],
  redoStack: [],

  setWorkflow: (workflow, path) =>
    set({
      activeWorkflow: workflow,
      activeWorkflowPath: path ?? null,
      isDirty: false,
      undoStack: [],
      redoStack: [],
    }),

  updateWorkflow: (workflow) =>
    set((s) => ({
      activeWorkflow: workflow,
      isDirty: true,
      undoStack: s.activeWorkflow
        ? [...s.undoStack.slice(-MAX_UNDO + 1), s.activeWorkflow]
        : s.undoStack,
      redoStack: [],
    })),

  markClean: () => set({ isDirty: false }),

  undo: () => {
    const { undoStack, activeWorkflow } = get()
    if (undoStack.length === 0 || !activeWorkflow) return
    const prev = undoStack[undoStack.length - 1]
    set((s) => ({
      activeWorkflow: prev,
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, activeWorkflow],
      isDirty: true,
    }))
  },

  redo: () => {
    const { redoStack, activeWorkflow } = get()
    if (redoStack.length === 0 || !activeWorkflow) return
    const next = redoStack[redoStack.length - 1]
    set((s) => ({
      activeWorkflow: next,
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, activeWorkflow],
      isDirty: true,
    }))
  },

  clear: () =>
    set({
      activeWorkflow: null,
      activeWorkflowPath: null,
      isDirty: false,
      undoStack: [],
      redoStack: [],
    }),
}))
