import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface WorkspaceState {
  /** Whether a blocking operation is in progress */
  spinner: boolean
  /** Whether shift key is held */
  shiftDown: boolean
  /** Focus mode hides everything except the graph editor */
  focusMode: boolean
  /** Active sidebar tab ID */
  activeSidebarTab: string | null
  /** Whether the sidebar is collapsed */
  sidebarCollapsed: boolean

  // Actions
  setSpinner: (spinning: boolean) => void
  setShiftDown: (down: boolean) => void
  toggleFocusMode: () => void
  setActiveSidebarTab: (tabId: string | null) => void
  toggleSidebar: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  subscribeWithSelector((set) => ({
    spinner: false,
    shiftDown: false,
    focusMode: false,
    activeSidebarTab: 'queue',
    sidebarCollapsed: false,

    setSpinner: (spinning) => set({ spinner: spinning }),
    setShiftDown: (down) => set({ shiftDown: down }),
    toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
    setActiveSidebarTab: (tabId) => set({ activeSidebarTab: tabId }),
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  }))
)
