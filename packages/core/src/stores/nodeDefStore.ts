import { create } from 'zustand'
import type { NodeDefinition } from '../types/graph'

export interface NodeDefStoreState {
  /** All registered node definitions, keyed by node type name */
  nodeDefs: Map<string, NodeDefinition>
  /** Categories for the node browser */
  categories: string[]
  /** Whether definitions are loaded */
  isLoaded: boolean

  // Actions
  setNodeDefs: (defs: Record<string, NodeDefinition>) => void
  addNodeDef: (name: string, def: NodeDefinition) => void
  removeNodeDef: (name: string) => void
  getByCategory: (category: string) => NodeDefinition[]
}

export const useNodeDefStore = create<NodeDefStoreState>()((set, get) => ({
  nodeDefs: new Map(),
  categories: [],
  isLoaded: false,

  setNodeDefs: (defs) => {
    const map = new Map(Object.entries(defs))
    const categories = [...new Set([...map.values()].map((d) => d.category))].sort()
    set({ nodeDefs: map, categories, isLoaded: true })
  },

  addNodeDef: (name, def) =>
    set((s) => {
      const next = new Map(s.nodeDefs)
      next.set(name, def)
      const categories = [...new Set([...next.values()].map((d) => d.category))].sort()
      return { nodeDefs: next, categories }
    }),

  removeNodeDef: (name) =>
    set((s) => {
      const next = new Map(s.nodeDefs)
      next.delete(name)
      return { nodeDefs: next }
    }),

  getByCategory: (category) =>
    [...get().nodeDefs.values()].filter((d) => d.category === category),
}))
