// ============================================================
// src/components/Auth/LoginForm.jsx
// Formulario de inicio de sesión para administradores
// ============================================================

import { useState } from 'react'
import { LogIn, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react'
import { loginWithEmail } from './auth.js'
import { useTheme } from './ThemeContext.jsx'

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(email, password)
      onSuccess?.()
    } catch (err) {
      // Mapear errores de Firebase a mensajes amigables
      const codes = {
        'app/missing-firebase-config': 'Falta configurar Firebase. Crea el archivo .env.local con tus credenciales.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
        'auth/user-not-found': 'No existe una cuenta con este correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      }
      setError(codes[err.code] || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Decoración de fondo */}
      <div className="login-bg-decoration" />

      <div className="login-card card">
        {/* Encabezado */}
        <div className="login-header">
          <div className="login-logo">
            <Sparkles size={24} />
          </div>
          <h1 className="login-title">Bienvenido</h1>
          <p className="login-subtitle">
            Ingresa tus credenciales para administrar las reservas
          </p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Error global */}
          {error && (
            <div className="login-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-sm" />
                Iniciando sesión…
              </>
            ) : (
              <>
                <LogIn size={16} />
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <button className="login-back-btn" onClick={() => onSuccess?.()}>
            ← Volver al calendario
          </button>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .login-bg-decoration {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-brand-glow), transparent);
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 0;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .login-header {
          text-align: center;
          padding: 36px 32px 24px;
          background: linear-gradient(180deg, var(--color-brand-light), transparent);
        }

        .login-logo {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--color-brand);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 16px var(--color-brand-glow);
        }

        .login-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .login-form {
          padding: 0 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
        }

        [data-theme='dark'] .login-error {
          background: #450a0a;
          color: #f87171;
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper .form-input {
          padding-right: 42px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .password-toggle:hover {
          color: var(--color-text-primary);
        }

        .login-submit {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 15px;
          margin-top: 4px;
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        .login-footer {
          padding: 16px 32px 24px;
          border-top: 1px solid var(--color-border);
          text-align: center;
        }

        .login-back-btn {
          background: none;
          border: none;
          color: var(--color-brand);
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.15s;
        }

        .login-back-btn:hover { opacity: 0.8; }
      `}</style>
    </div>
  )
}
