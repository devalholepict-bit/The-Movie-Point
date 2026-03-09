import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',       // Vercel reads frontend/dist as configured in vercel.json
    emptyOutDir: true,
  },
  // During local dev, proxy /api calls to the Express backend
  // so you never need to change VITE_API_BASE_URL for local work
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
