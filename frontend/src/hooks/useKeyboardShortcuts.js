import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function useKeyboardShortcuts({
  onSearch,
  onPrevious,
  onNext,
  onToggleSidebar,
  onScrollToTop
}) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si l'utilisateur tape dans un input, textarea, ou contenteditable
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable ||
        e.target.closest('input') ||
        e.target.closest('textarea')
      ) {
        // Permettre Escape pour fermer les modales/recherche
        if (e.key === 'Escape') {
          // Laisser les composants individuels gérer Escape
          return
        }
        return
      }

      // Raccourcis globaux
      switch (e.key) {
        case '/':
          // Ouvrir la recherche
          e.preventDefault()
          if (onSearch) {
            onSearch()
          } else {
            navigate('/search')
          }
          break

        case 'ArrowLeft':
          // Navigation précédente (seulement sur les pages de leçon)
          if (location.pathname.startsWith('/lesson/') && onPrevious) {
            e.preventDefault()
            onPrevious()
          }
          break

        case 'ArrowRight':
          // Navigation suivante (seulement sur les pages de leçon)
          if (location.pathname.startsWith('/lesson/') && onNext) {
            e.preventDefault()
            onNext()
          }
          break

        case 'b':
          // Toggle sidebar (si pas de modale ouverte)
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (onToggleSidebar) {
              onToggleSidebar()
            }
          }
          break

        case 'Home':
          // Scroll to top
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (onScrollToTop) {
              onScrollToTop()
            }
          }
          break

        case 'Escape':
          // Fermer la sidebar en mode mobile
          if (onToggleSidebar && window.innerWidth < 1024) {
            onToggleSidebar(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, location.pathname, onSearch, onPrevious, onNext, onToggleSidebar, onScrollToTop])
}

