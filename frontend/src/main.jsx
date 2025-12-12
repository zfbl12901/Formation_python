import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Enregistrer le Service Worker pour PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope)
        
        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouveau service worker disponible
              console.log('Nouveau Service Worker disponible')
              // Optionnel: Afficher une notification à l'utilisateur
            }
          })
        })
      })
      .catch((error) => {
        console.error('Erreur lors de l\'enregistrement du Service Worker:', error)
      })
  })
}

// Vérifier que le root existe
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Élément root introuvable!')
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>,
    )
  } catch (error) {
    console.error('Erreur lors du rendu de React:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; color: white; background: #1a1a1a;">
        <h1>Erreur de chargement</h1>
        <p>${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `
  }
}


