/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { loginWithEmail, registerWithEmail } from '../services/firebaseRest'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const login = async (email, password) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const user = await loginWithEmail(email, password)
      setCurrentUser(user)
      return user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const register = async (email, password) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      const user = await registerWithEmail(email, password)
      setCurrentUser(user)
      return user
    } catch (error) {
      setAuthError(error.message)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setAuthError(null)
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      authLoading,
      authError,
      login,
      register,
      logout
    }),
    [currentUser, authLoading, authError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
