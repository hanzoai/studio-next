/** Authenticated user state */
export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

/** Auth state */
export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

/** API key auth */
export interface ApiKeyAuth {
  apiKey: string
  isAuthenticated: boolean
}
