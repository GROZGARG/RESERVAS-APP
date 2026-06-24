// ============================================================
// src/components/Layout/Sidebar.jsx
// Barra lateral de navegación
// ============================================================

import { useState } from 'react'
import {
  CalendarDays,
  Building2,
  LayoutList,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from './AuthContext.jsx'
import { useTheme } from './ThemeContext.jsx'
import { logout } from './auth.js'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { id: 'calendar', label: 'Calendario', icon: CalendarDays },
  { id: 'reservations', label: 'Reservas', icon: LayoutList },
]

const ADMIN_ITEMS = [
  { id: 'spaces', label: 'Espacios', icon: Building2 },
]

export default function Sidebar({ currentView, onNavigate }) {
  const { user, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Sesión cerrada')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  const navigate = (view) => {
    onNavigate(view)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="sidebar-inner">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="sidebar-logo-name">ReservaSpace</div>
          <div className="sidebar-logo-tagline">Gestión de espacios</div>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Principal</div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-link ${currentView === id ? 'active' : ''}`}
            onClick={() => navigate(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {currentView === id && <ChevronRight size={14} className="sidebar-link-chevron" />}
          </button>
        ))}

        {/* Sección de administración (solo para admin) */}
        {isAdmin && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 16 }}>Administración</div>
            {ADMIN_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`sidebar-link ${currentView === id ? 'active' : ''}`}
                onClick={() => navigate(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {currentView === id && <ChevronRight size={14} className="sidebar-link-chevron" />}
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Pie de sidebar */}
      <div className="sidebar-footer">
        {/* Toggle de tema */}
        <button className="sidebar-theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
        </button>

        {/* Usuario / Login */}
        {isAdmin ? (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-role">Administrador</div>
              <div className="sidebar-user-email">{user?.email}</div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="sidebar-login-btn" onClick={() => navigate('login')}>
            <LogIn size={16} />
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Botón hamburguesa (móvil) */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={22} />
      </button>

      {/* Overlay móvil */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar desktop */}
      <aside className={`sidebar sidebar-desktop`}>
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      <aside className={`sidebar sidebar-mobile ${mobileOpen ? 'open' : ''}`}>
        <button
          className="sidebar-close-btn"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      <style>{`
        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: background 0.3s ease;
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0;
          overflow-y: auto;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 18px 16px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .sidebar-logo-icon {
          width: 38px;
          height: 38px;
          background: var(--color-brand);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-logo-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: var(--color-text-primary);
          line-height: 1.2;
        }

        .sidebar-logo-tagline {
          font-size: 11px;
          color: var(--color-text-muted);
          margin-top: 1px;
        }

        .sidebar-nav {
          padding: 14px 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-section-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          padding: 4px 10px 6px;
          margin-top: 4px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.15s ease;
          position: relative;
        }

        .sidebar-link:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }

        .sidebar-link.active {
          background: var(--color-brand-light);
          color: var(--color-brand);
          font-weight: 600;
        }

        .sidebar-link-chevron {
          margin-left: auto;
          opacity: 0.6;
        }

        .sidebar-footer {
          padding: 12px 10px 16px;
          border-top: 1px solid var(--color-border-light);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-theme-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          font-size: 13px;
          color: var(--color-text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          transition: all 0.15s ease;
        }

        .sidebar-theme-toggle:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-primary);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          background: var(--color-surface-hover);
        }

        .sidebar-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-brand);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .sidebar-user-info {
          flex: 1;
          min-width: 0;
        }

        .sidebar-user-role {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .sidebar-user-email {
          font-size: 11px;
          color: var(--color-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-login-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-brand);
          background: var(--color-brand-light);
          border: 1.5px solid var(--color-brand);
          cursor: pointer;
          width: 100%;
          transition: all 0.15s ease;
        }

        .sidebar-login-btn:hover {
          background: var(--color-brand);
          color: white;
        }

        /* Mobile toggle */
        .sidebar-mobile-toggle {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 900;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-md);
          transition: all 0.15s ease;
        }

        .sidebar-close-btn {
          display: none;
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--color-surface-hover);
          border: none;
          color: var(--color-text-secondary);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }

        .sidebar-overlay {
          display: none;
        }

        .sidebar-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }

          .sidebar-mobile-toggle { display: flex; }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: var(--overlay-bg);
            z-index: 999;
            animation: fadeIn 0.2s ease;
          }

          .sidebar-mobile {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-xl);
          }

          .sidebar-mobile.open {
            transform: translateX(0);
          }

          .sidebar-close-btn { display: flex; }
        }
      `}</style>
    </>
  )
}
