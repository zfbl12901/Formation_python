import { useEffect } from 'react'
import { apiCache } from '../utils/cache'

/**
 * Hook pour précharger la leçon suivante
 */
export function usePreloadNextLesson(navigation) {
  useEffect(() => {
    if (!navigation?.next) return

    // Précharger la leçon suivante et sa navigation en arrière-plan
    const preloadNext = async () => {
      const nextPath = navigation.next.path
      
      // Précharger la leçon suivante
      apiCache.preload(`/api/lessons/${nextPath}`)
      
      // Précharger la navigation de la leçon suivante
      apiCache.preload(`/api/navigation/${nextPath}`)
    }

    // Attendre un peu avant de précharger pour ne pas ralentir le chargement actuel
    const timeoutId = setTimeout(preloadNext, 1000)

    return () => clearTimeout(timeoutId)
  }, [navigation?.next?.path])
}

/**
 * Hook pour précharger plusieurs leçons
 */
export function usePreloadLessons(lessonPaths) {
  useEffect(() => {
    if (!lessonPaths || lessonPaths.length === 0) return

    // Précharger les leçons en arrière-plan
    const preloadLessons = async () => {
      const urls = lessonPaths.map(path => `/api/lessons/${path}`)
      await apiCache.preloadMultiple(urls)
    }

    // Attendre que la page soit chargée
    const timeoutId = setTimeout(preloadLessons, 2000)

    return () => clearTimeout(timeoutId)
  }, [lessonPaths])
}

