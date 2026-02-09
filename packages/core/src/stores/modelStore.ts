import { create } from 'zustand'
import type { ModelFile, ModelType } from '../types/model'

export interface ModelStoreState {
  /** All known model files, grouped by type */
  models: Map<ModelType, ModelFile[]>
  /** Whether models are loaded */
  isLoaded: boolean

  // Actions
  setModels: (type: ModelType, files: ModelFile[]) => void
  setAllModels: (models: Record<ModelType, ModelFile[]>) => void
  addModel: (type: ModelType, file: ModelFile) => void
  removeModel: (type: ModelType, name: string) => void
}

export const useModelStore = create<ModelStoreState>()((set) => ({
  models: new Map(),
  isLoaded: false,

  setModels: (type, files) =>
    set((s) => {
      const next = new Map(s.models)
      next.set(type, files)
      return { models: next }
    }),

  setAllModels: (models) => {
    const map = new Map(Object.entries(models) as [ModelType, ModelFile[]][])
    set({ models: map, isLoaded: true })
  },

  addModel: (type, file) =>
    set((s) => {
      const next = new Map(s.models)
      const existing = next.get(type) ?? []
      next.set(type, [...existing, file])
      return { models: next }
    }),

  removeModel: (type, name) =>
    set((s) => {
      const next = new Map(s.models)
      const existing = next.get(type) ?? []
      next.set(type, existing.filter((f) => f.name !== name))
      return { models: next }
    }),
}))
