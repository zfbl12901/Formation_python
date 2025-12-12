import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, Tag } from 'lucide-react'

function SidebarSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allLessons, setAllLessons] = useState([])
  const [allTags, setAllTags] = useState({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Charger les leçons et tags
    const fetchData = async () => {
      try {
        // Utiliser fetchWithCache qui gère automatiquement GitHub API ou backend
        const { fetchWithCache } = await import('../utils/cache.js')
        const [lessonsData, tagsData] = await Promise.all([
          fetchWithCache('/api/lessons'),
          fetchWithCache('/api/tags')
        ])
        setAllLessons(lessonsData.lessons || [])
        setAllTags(tagsData.tags || {})
      } catch (err) {
        console.error('Erreur lors du chargement:', err)
      }
    }

    // Charger l'historique depuis localStorage
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Erreur lors du chargement de l\'historique:', e)
      }
    }

    fetchData()
  }, [])

  // Fermer les suggestions en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showSuggestions])

  useEffect(() => {
    if (query.trim().length > 0) {
      generateSuggestions(query)
    } else {
      setSuggestions([])
    }
  }, [query, allLessons])

  const generateSuggestions = (searchQuery) => {
    const queryLower = searchQuery.toLowerCase()
    const results = []

    // Rechercher dans les titres
    allLessons.forEach((lesson) => {
      if (lesson.title.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'lesson',
          title: lesson.title,
          path: lesson.path,
          tags: lesson.tags || []
        })
      }
    })

    // Rechercher dans les tags
    Object.keys(allTags).forEach((tag) => {
      if (tag.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'tag',
          title: tag,
          count: allTags[tag]
        })
      }
    })

    // Limiter à 8 suggestions
    setSuggestions(results.slice(0, 8))
  }

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return

    // Ajouter à l'historique
    const newHistory = [
      searchQuery,
      ...searchHistory.filter((item) => item !== searchQuery)
    ].slice(0, 10) // Garder seulement les 10 dernières recherches

    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    // Naviguer vers la page de recherche
    const params = new URLSearchParams()
    params.set('q', searchQuery)
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','))
    }
    navigate(`/search?${params.toString()}`)
    setQuery('')
    setShowSuggestions(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  const selectSuggestion = (suggestion) => {
    if (suggestion.type === 'lesson') {
      navigate(`/lesson/${suggestion.path}`)
      setQuery('')
      setShowSuggestions(false)
    } else if (suggestion.type === 'tag') {
      toggleTag(suggestion.title)
      setQuery('')
      setShowSuggestions(false)
    }
  }

  const selectHistoryItem = (item) => {
    setQuery(item)
    handleSearch(item)
  }

  return (
    <div className="mb-4 relative" ref={searchRef}>
      {/* Champ de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-textSecondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-8 py-2 bg-dark-bg border border-dark-border rounded-lg text-sm text-white placeholder-dark-textSecondary focus:outline-none focus:border-dark-accent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-dark-textSecondary hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions et historique */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0 || selectedTags.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface border border-dark-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
          {/* Tags sélectionnés */}
          {selectedTags.length > 0 && (
            <div className="p-3 border-b border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3.5 h-3.5 text-dark-accent" />
                <span className="text-xs font-semibold text-dark-textSecondary uppercase">Filtres actifs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-2 py-1 bg-dark-accent text-white rounded text-xs flex items-center gap-1 hover:bg-dark-accentHover"
                  >
                    {tag}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-dark-surfaceHover transition-colors flex items-center gap-2 group"
                >
                  {suggestion.type === 'lesson' ? (
                    <>
                      <Search className="w-4 h-4 text-dark-textSecondary group-hover:text-dark-accent" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white group-hover:text-dark-accent truncate">
                          {suggestion.title}
                        </div>
                        {suggestion.tags && suggestion.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {suggestion.tags.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs text-dark-textSecondary bg-dark-bg px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Tag className="w-4 h-4 text-dark-textSecondary group-hover:text-dark-accent" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white group-hover:text-dark-accent">
                          {suggestion.title}
                        </div>
                        <div className="text-xs text-dark-textSecondary">
                          {suggestion.count} leçon{suggestion.count > 1 ? 's' : ''}
                        </div>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Historique */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div className="p-2 border-t border-dark-border">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-dark-textSecondary" />
                <span className="text-xs font-semibold text-dark-textSecondary uppercase">Recherches récentes</span>
              </div>
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => selectHistoryItem(item)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-dark-surfaceHover transition-colors flex items-center gap-2 text-sm text-dark-textSecondary hover:text-white"
                >
                  <Clock className="w-4 h-4" />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Action de recherche */}
          {query.trim().length > 0 && (
            <div className="p-2 border-t border-dark-border">
              <button
                onClick={() => handleSearch()}
                className="w-full px-3 py-2 bg-dark-accent hover:bg-dark-accentHover text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Rechercher "{query}"
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filtres rapides par tags */}
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3.5 h-3.5 text-dark-textSecondary" />
          <span className="text-xs font-semibold text-dark-textSecondary uppercase">Filtres rapides</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar">
          {Object.entries(allTags)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  selectedTags.includes(tag)
                    ? 'bg-dark-accent text-white'
                    : 'bg-dark-bg text-dark-textSecondary hover:bg-dark-surfaceHover hover:text-white'
                }`}
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            ))}
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={() => {
              const params = new URLSearchParams()
              params.set('tags', selectedTags.join(','))
              navigate(`/search?${params.toString()}`)
            }}
            className="mt-2 w-full px-3 py-1.5 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent rounded text-xs font-medium transition-colors"
          >
            Voir {selectedTags.length} filtre{selectedTags.length > 1 ? 's' : ''} actif{selectedTags.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  )
}

export default SidebarSearch

