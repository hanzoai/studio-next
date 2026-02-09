/**
 * Firebase Auth integration - platform-agnostic wrapper.
 *
 * The actual Firebase SDK initialization happens in each platform's entry.
 * This module provides the auth logic that works with the useAuthStore.
 */
import { useAuthStore } from '../stores/authStore'
import type { User } from '../types/auth'

export interface FirebaseAuthAdapter {
  onAuthStateChanged(cb: (user: User | null) => void): () => void
  signInWithGoogle(): Promise<User>
  signInWithEmail(email: string, password: string): Promise<User>
  signUp(email: string, password: string): Promise<User>
  signOut(): Promise<void>
  getIdToken(): Promise<string | null>
}

let _adapter: FirebaseAuthAdapter | null = null

export function setAuthAdapter(adapter: FirebaseAuthAdapter): void {
  _adapter = adapter
}

export function getAuthAdapter(): FirebaseAuthAdapter {
  if (!_adapter) throw new Error('Auth adapter not initialized')
  return _adapter
}

/** Start listening to auth state changes, updating the store */
export function startAuthListener(): () => void {
  const adapter = getAuthAdapter()
  const store = useAuthStore.getState()
  store.setLoading(true)

  return adapter.onAuthStateChanged((user) => {
    useAuthStore.getState().setUser(user)
  })
}

export async function signInWithGoogle(): Promise<void> {
  const adapter = getAuthAdapter()
  useAuthStore.getState().setLoading(true)
  try {
    const user = await adapter.signInWithGoogle()
    useAuthStore.getState().setUser(user)
  } catch (e) {
    useAuthStore.getState().setError(e instanceof Error ? e.message : 'Sign-in failed')
  }
}

export async function signOut(): Promise<void> {
  const adapter = getAuthAdapter()
  await adapter.signOut()
  useAuthStore.getState().signOut()
}
