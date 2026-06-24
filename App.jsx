// ============================================================
// src/App.jsx
// Componente raíz de la aplicación — enrutamiento de vistas
// ============================================================

import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

// Contextos
import { AuthProvider, useAuth } from './AuthContext.jsx'
import { ThemeProvider } from './ThemeContext.jsx'

// Hooks
import { useReservations } from './useReservations.js'
import { useSpaces } from './useSpaces.js'

// Servicios
import { seedInitialData } from './firestore.js'
import { isFirebaseConfigured } from './firebase.js'

// Componentes
import Sidebar from './Sidebar.jsx'
import CalendarView from './CalendarView.jsx'
import ReservationsList from './ReservationsList.jsx'
import SpacesManager from './SpacesManager.jsx'
import LoginForm from './LoginForm.jsx'

// Estilos
import './global.css'

// ── Pantalla de carga global ─────────────────────────────
function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--color-bg)',
      }}
    >
      <div className="spinner" />
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
        Cargando ReservaSpace…
      </p>
    </div>
  )
}

function FirebaseSetupScreen() {
  return (
    <div className="setup-page">
      <div className="setup-panel card">
        <h1 className="setup-title">Configura Firebase</h1>
        <p className="setup-text">
          La app ya compila, pero falta el archivo <code>.env.local</code> con las credenciales
          de tu proyecto Firebase.
        </p>
        <ol className="setup-list">
          <li>Copia <code>env.example</code> y renombralo como <code>.env.local</code>.</li>
          <li>En Firebase Console, abre tu proyecto y copia la configuracion web.</li>
          <li>Rellena las variables <code>VITE_FIREBASE_*</code> y reinicia Vite.</li>
        </ol>
      </div>
    </div>
  )
}

// ── Vista principal (requiere auth context activo) ───────
function AppContent() {
  const { loading: authLoading, isAdmin } = useAuth()
  const [currentView, setCurrentView] = useState('calendar')

  // Hooks de datos
  const {
    reservations, loading: resLoading,
    addReservation, editReservation, removeReservation,
  } = useReservations()

  const {
    spaces, loading: spacesLoading,
    addSpace, editSpace, removeSpace,
    getSpaceColor, getSpaceName,
  } = useSpaces()

  // Sembrar datos iniciales si la BD esta vacia y ya hay admin autenticado.
  useEffect(() => {
    if (isFirebaseConfigured && isAdmin) {
      seedInitialData().catch(console.error)
    }
  }, [isAdmin])

  // Redirigir a calendario si no es admin e intenta acceder a admin-only views
  useEffect(() => {
    if (!isAdmin && (currentView === 'spaces')) {
      setCurrentView('calendar')
    }
  }, [isAdmin, currentView])

  if (authLoading) return <LoadingScreen />

  if (!isFirebaseConfigured) {
    return <FirebaseSetupScreen />
  }

  // Vista de login
  if (currentView === 'login') {
    return (
      <ThemeProvider>
        <LoginForm onSuccess={() => setCurrentView('calendar')} />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </ThemeProvider>
    )
  }

  const isLoading = resLoading || spacesLoading

  return (
    <div className="app-layout">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <main className="main-content">
        <div className="page-content">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {currentView === 'calendar' && (
                <CalendarView
                  reservations={reservations}
                  spaces={spaces}
                  onAdd={addReservation}
                  onEdit={editReservation}
                  onDelete={removeReservation}
                  getSpaceName={getSpaceName}
                  getSpaceColor={getSpaceColor}
                />
              )}

              {currentView === 'reservations' && (
                <ReservationsList
                  reservations={reservations}
                  spaces={spaces}
                  onAdd={addReservation}
                  onEdit={editReservation}
                  onDelete={removeReservation}
                  getSpaceName={getSpaceName}
                  getSpaceColor={getSpaceColor}
                />
              )}

              {currentView === 'spaces' && isAdmin && (
                <SpacesManager
                  spaces={spaces}
                  onAdd={addSpace}
                  onEdit={editSpace}
                  onDelete={removeSpace}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Notificaciones toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: 'var(--shadow-lg)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  )
}

// ── Root con proveedores ─────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
