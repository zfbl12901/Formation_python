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

// Fonction helper pour fetch avec cache
// Accepte soit une URL complète, soit un chemin relatif (ex: 'lessons' ou '/api/lessons')
export async function fetchWithCache(url, options = {}) {
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

