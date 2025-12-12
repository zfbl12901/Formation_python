// Système de cache intelligent pour les données API
class APICache {
  constructor(maxAge = 5 * 60 * 1000) { // 5 minutes par défaut
    this.cache = new Map()
    this.maxAge = maxAge
  }

  // Générer une clé de cache à partir d'une URL
  getKey(url) {
    return url
  }

  // Vérifier si une entrée est valide (non expirée)
  isValid(entry) {
    if (!entry) return false
    return Date.now() - entry.timestamp < this.maxAge
  }

  // Obtenir une valeur du cache
  get(url) {
    const key = this.getKey(url)
    const entry = this.cache.get(key)
    
    if (this.isValid(entry)) {
      return entry.data
    }
    
    // Supprimer l'entrée expirée
    if (entry) {
      this.cache.delete(key)
    }
    
    return null
  }

  // Mettre une valeur en cache
  set(url, data) {
    const key = this.getKey(url)
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // Précharger une URL (fetch et mettre en cache)
  async preload(url) {
    // Si déjà en cache et valide, ne rien faire
    if (this.get(url)) {
      return this.get(url)
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      this.set(url, data)
      return data
    } catch (error) {
      console.warn(`Erreur lors du préchargement de ${url}:`, error)
      return null
    }
  }

  // Précharger plusieurs URLs en parallèle
  async preloadMultiple(urls) {
    return Promise.all(urls.map(url => this.preload(url)))
  }

  // Nettoyer le cache (supprimer les entrées expirées)
  cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.maxAge) {
        this.cache.delete(key)
      }
    }
  }

  // Vider complètement le cache
  clear() {
    this.cache.clear()
  }

  // Obtenir la taille du cache
  size() {
    return this.cache.size
  }
}

// Instance globale du cache
export const apiCache = new APICache(5 * 60 * 1000) // 5 minutes

// Nettoyer le cache toutes les 10 minutes
setInterval(() => {
  apiCache.cleanup()
}, 10 * 60 * 1000)

// Import de apiUrl (import statique pour éviter les problèmes)
import { apiUrl } from './api.js'
import * as githubApi from './githubApi.js'

// Mode : 'backend' ou 'github'
// Si VITE_API_URL est défini, utiliser le backend, sinon utiliser GitHub API
const API_MODE = import.meta.env.VITE_API_URL ? 'backend' : 'github'

// Fonction helper pour fetch avec cache
// Accepte soit une URL complète, soit un chemin relatif (ex: 'lessons' ou '/api/lessons')
export async function fetchWithCache(url, options = {}) {
  // Si on utilise GitHub API, mapper les endpoints
  if (API_MODE === 'github') {
    return fetchWithCacheGitHub(url, options)
  }
  
  // Sinon, utiliser le backend classique
  return fetchWithCacheBackend(url, options)
}

// Fetch avec cache pour GitHub API
async function fetchWithCacheGitHub(url, options = {}) {
  // Mapper les endpoints GitHub API
  let cacheKey = url
  let dataPromise
  
  if (url === '/api/lessons' || url === 'lessons') {
    cacheKey = 'github:lessons'
    dataPromise = githubApi.getAllLessons()
  } else if (url.startsWith('/api/tags') || url === 'tags') {
    cacheKey = 'github:tags'
    dataPromise = githubApi.getAllTags()
  } else if (url.startsWith('/api/hierarchy') || url === 'hierarchy') {
    cacheKey = 'github:hierarchy'
    dataPromise = githubApi.getHierarchy()
  } else if (url.startsWith('/api/lessons/')) {
    const path = url.replace('/api/lessons/', '').replace('lessons/', '')
    cacheKey = `github:lesson:${path}`
    dataPromise = githubApi.getLesson(`content/${path}`)
  } else if (url.startsWith('/api/navigation/')) {
    const path = url.replace('/api/navigation/', '').replace('navigation/', '')
    cacheKey = `github:navigation:${path}`
    // Pour la navigation, on a besoin de toutes les leçons
    const { lessons } = await fetchWithCacheGitHub('/api/lessons')
    const currentIndex = lessons.findIndex(l => l.path === path)
    const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null
    const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
    dataPromise = Promise.resolve({
      previous: previous ? { path: previous.path, title: previous.title } : null,
      next: next ? { path: next.path, title: next.title } : null,
      breadcrumb: [] // Simplifié pour l'instant
    })
  } else {
    // Endpoint non supporté, essayer le backend
    return fetchWithCacheBackend(url, options)
  }
  
  // Vérifier le cache
  const cached = apiCache.get(cacheKey)
  if (cached) {
    return cached
  }
  
  // Faire la requête
  try {
    const data = await dataPromise
    apiCache.set(cacheKey, data)
    return data
  } catch (error) {
    console.error(`Erreur lors du fetch GitHub de ${url}:`, error)
    throw error
  }
}

// Fetch avec cache pour le backend
async function fetchWithCacheBackend(url, options = {}) {
  // Normaliser l'URL : si c'est un chemin relatif, construire l'URL complète
  let fullUrl = url
  
  // Si l'URL ne commence pas par http:// ou https://, c'est un chemin relatif
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Si l'URL commence par /api/, enlever le préfixe
    if (url.startsWith('/api/')) {
      fullUrl = apiUrl(url.replace('/api/', ''))
    } else if (url.startsWith('/')) {
      // Si c'est juste un chemin qui commence par /, construire l'URL API
      fullUrl = apiUrl(url.slice(1))
    } else {
      // Sinon, c'est juste un chemin (ex: 'lessons')
      fullUrl = apiUrl(url)
    }
  }
  
  // Vérifier le cache d'abord
  const cached = apiCache.get(fullUrl)
  if (cached) {
    return cached
  }

  // Si pas en cache, faire la requête
  try {
    const response = await fetch(fullUrl, options)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    // Mettre en cache
    apiCache.set(fullUrl, data)
    
    return data
  } catch (error) {
    console.error(`Erreur lors du fetch de ${fullUrl}:`, error)
    throw error
  }
}

