/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          surfaceHover: '#2a2a2a',
          surfaceLight: '#2d2d2d',
          border: '#333333',
          text: '#e5e5e5',
          textSecondary: '#a0a0a0',
          accent: '#3b82f6',
          accentHover: '#2563eb',
        },
        light: {
          bg: '#ffffff',
          surface: '#f8f9fa',
          surfaceHover: '#e9ecef',
          surfaceLight: '#f1f3f5',
          border: '#dee2e6',
          text: '#212529',
          textSecondary: '#6c757d',
          accent: '#0d6efd',
          accentHover: '#0b5ed7',
        }
      }
    },
  },
  plugins: [],
}


