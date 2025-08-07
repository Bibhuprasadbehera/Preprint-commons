import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/search': 'http://127.0.0.1:8000',
      '/paper': 'http://127.0.0.1:8000',
      '/country-data': 'http://127.0.0.1:8000'
    }
  }
})
