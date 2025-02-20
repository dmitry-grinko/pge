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

  initializeFromStorage: () => {
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
  },

  login: async (email: string, password: string) => {
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
  },

  signup: async (email: string, password: string) => {
    await apiSignup(email, password)
  },

  verifyEmail: async (email: string, code: string) => {
    await apiVerifyEmail(email, code)
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiry')

    set({
      isAuthenticated: false,
      tokens: null,
      tokenExpiry: null
    })
  },

  checkAuth: () => {
    const { tokenExpiry, isAuthenticated } = get()
    if (!tokenExpiry || !isAuthenticated) return false
    return Date.now() < tokenExpiry
  }
})) 