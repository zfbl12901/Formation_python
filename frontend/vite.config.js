import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Déterminer le base path selon l'environnement
// Pour GitHub Pages, utilisez '/Formation_python/'
// Pour le développement local, utilisez '/'
const base = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production' 
  ? '/Formation_python/' 
  : '/'

export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown-vendor': ['marked', 'prismjs']
        }
      }
    }
  },
  publicDir: 'public'
})


