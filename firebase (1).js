// ============================================================
// src/services/firebase.js
// Configuración e inicialización de Firebase
// ============================================================
// Las credenciales se leen de variables de entorno de Vite.
// En local: crea un archivo .env.local basado en .env.example
// En producción (GitHub Actions): se inyectan desde GitHub Secrets
// ============================================================

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Verificación en desarrollo
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length > 0) {
    console.warn(
      '⚠️  Firebase: faltan variables de entorno:',
      missing.join(', '),
      '\n→ Copia .env.example como .env.local y completa los valores.'
    )
  }
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)

// Persistencia offline
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firebase: persistencia inhabilitada — múltiples pestañas abiertas')
  } else if (err.code === 'unimplemented') {
    console.warn('Firebase: persistencia no soportada en este navegador')
  }
})

export default app
