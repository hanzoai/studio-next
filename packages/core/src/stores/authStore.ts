import { create } from 'zustand'
import type { AuthState, User } from '../types/auth'

export interface AuthStoreState extends AuthState {
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  signOut: () => void
}

export const useAuthStore = create<AuthStoreState>()((set) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  signOut: () => set({ user: null, isLoading: false, error: null }),
}))
