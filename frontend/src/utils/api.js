// Configuration de l'URL de l'API
// En développement : utilise le proxy Vite (http://localhost:8000)
// En production : utilise VITE_API_URL ou l'URL par défaut

const getApiUrl = () => {
  // En développement, Vite proxy gère /api
  if (import.meta.env.DEV) {
    return ''
  }
  
  // En production, utiliser VITE_API_URL ou une URL par défaut
  const apiUrl = import.meta.env.VITE_API_URL
  
  if (apiUrl) {
    // Si VITE_API_URL est défini, l'utiliser
    return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
  }
  
  // Par défaut, essayer de détecter l'URL du backend
  // Si le backend est déployé, remplacez cette URL
  return 'https://your-backend-url.com'
}

export const API_BASE_URL = getApiUrl()

// Helper pour construire les URLs de l'API
export const apiUrl = (path) => {
  // Enlever le slash initial si présent
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  if (import.meta.env.DEV) {
    // En développement, utiliser le proxy Vite
    return `/api/${cleanPath}`
  }
  
  // En production, utiliser l'URL complète
  return `${API_BASE_URL}/api/${cleanPath}`
}

// Helper pour faire des requêtes POST
export const apiPost = async (path, data) => {
  const url = apiUrl(path)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

