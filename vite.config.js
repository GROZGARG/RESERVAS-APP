import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// IMPORTANTE: Cambia 'reservas-app' por el nombre exacto de tu repositorio en GitHub
export default defineConfig({
  plugins: [react()],
  base: '/RESERVAS-APP/', // 👈 Cambiar por el nombre de tu repositorio
})
