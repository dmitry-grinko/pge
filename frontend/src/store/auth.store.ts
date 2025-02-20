import { create } from 'zustand'
import { login as apiLogin, signup as apiSignup, verifyEmail as apiVerifyEmail } from '@/services/api'

interface AuthTokens {
  accessToken: string
  idToken: string
  refreshToken: string
}

interface AuthState {
  isAuthenticated: boolean
  tokens: AuthTokens | null
  tokenExpiry: number | null
  isInitialized: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<void>
  logout: () => void
  checkAuth: () => boolean
  initializeFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  tokens: null,
  tokenExpiry: null,
  isInitialized: false,

  initializeFromStorage: () => {
    if (get().isInitialized) return;

    try {
      const accessToken = localStorage.getItem('accessToken')
      const idToken = localStorage.getItem('idToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const tokenExpiry = localStorage.getItem('tokenExpiry')

      if (accessToken && idToken && refreshToken && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry)
        if (Date.now() < expiryTime) {
          set({
            isAuthenticated: true,
            tokens: { accessToken, idToken, refreshToken },
            tokenExpiry: expiryTime
          })
        } else {
          get().logout()
        }
      }
    } catch (error) {
      console.error('Failed to initialize from storage:', error)
      get().logout()
    } finally {
      set({ isInitialized: true })
    }
  },

  login: async (email: string, password: string) => {
    try {
      const tokens = await apiLogin(email, password)
      const expiry = Date.now() + (60 * 60 * 1000) // 1 hour

      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('idToken', tokens.idToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('tokenExpiry', expiry.toString())

      set({
        isAuthenticated: true,
        tokens,
        tokenExpiry: expiry
      })
    } catch (error) {
      get().logout()
      throw error
    }
  },

  signup: async (email: string, password: string) => {
    await apiSignup(email, password)
  },

  verifyEmail: async (email: string, code: string) => {
    await apiVerifyEmail(email, code)
  },

  logout: () => {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('idToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpiry')
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }

    set({
      isAuthenticated: false,
      tokens: null,
      tokenExpiry: null
    })
  },

  checkAuth: () => {
    const { tokenExpiry, isAuthenticated } = get()
    if (!tokenExpiry || !isAuthenticated) return false
    
    const isValid = Date.now() < tokenExpiry
    if (!isValid) {
      get().logout()
    }
    return isValid
  }
})) 