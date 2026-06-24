// ============================================================
// src/contexts/ThemeContext.jsx
// Contexto de tema (claro / oscuro)
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Leer preferencia guardada o detectar preferencia del sistema
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    // Aplicar clase al <html> para CSS variables
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
