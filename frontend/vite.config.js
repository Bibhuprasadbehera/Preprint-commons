import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Primary API endpoint
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      // Map data endpoint
      '/country-data': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      // Legacy/fallback endpoints - only proxy if they start with these patterns
      // Note: These won't interfere with React Router routes like /paper/:id
      '^/search': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '^/papers/search': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '^/authors/search': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})