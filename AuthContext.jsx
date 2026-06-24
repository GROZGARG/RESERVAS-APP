// ============================================================
// src/contexts/AuthContext.jsx
// Contexto global de autenticación
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from './auth.js'

const AuthContext = createContext(null)

/**
 * Proveedor de autenticación — envuelve toda la aplicación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Esperando respuesta de Firebase

  useEffect(() => {
    // Suscribirse a cambios de estado de autenticación
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe // Cancelar suscripción al desmontar
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook para acceder al contexto de autenticación
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
