import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Tag, BookOpen } from 'lucide-react'
import ListSkeleton from './ListSkeleton'
import { fetchWithCache } from '../utils/cache'
import { apiPost } from '../utils/api.js'

function SearchView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagsParam = searchParams.get('tags')
    return tagsParam ? tagsParam.split(',') : []
  })
  const [allTags, setAllTags] = useState({})
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await fetchWithCache('/api/tags')
        setAllTags(data.tags || {})
      } catch (err) {
        console.error('Erreur lors du chargement des tags:', err)
      }
    }
    fetchTags()
  }, [])

  useEffect(() => {
    if (query || selectedTags.length > 0) {
      performSearch()
    } else {
      setResults([])
    }
  }, [query, selectedTags])

  const performSearch = async () => {
    setLoading(true)
    try {
      // Vérifier si on utilise GitHub API ou le backend
      const useGitHub = !import.meta.env.VITE_API_URL
      
      if (useGitHub) {
        // Utiliser GitHub API
        const { searchLessons } = await import('../utils/githubApi.js')
        const data = await searchLessons(query, selectedTags.length > 0 ? selectedTags : null)
        setResults(data.lessons || [])
      } else {
        // Utiliser le backend
        const data = await apiPost('search', {
          query: query,
          tags: selectedTags.length > 0 ? selectedTags : null,
        })
        setResults(data.lessons || [])
      }
      setSearchParams({ q: query })
    } catch (err) {
      console.error('Erreur lors de la recherche:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Recherche</h1>
        <p className="text-dark-textSecondary">Recherchez dans le contenu et filtrez par tags</p>
      </div>

      <div className="bg-dark-surface rounded-lg border border-dark-border p-6 mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-textSecondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher dans les leçons..."
            className="w-full pl-12 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-dark-textSecondary focus:outline-none focus:border-dark-accent"
          />
        </div>

        {Object.keys(allTags).length > 0 && (
          <div>
            <p className="text-sm text-dark-textSecondary mb-3">Filtrer par tags:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(allTags).map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-2 ${
                    selectedTags.includes(tag)
                      ? 'bg-dark-accent text-white'
                      : 'bg-dark-bg text-dark-textSecondary hover:bg-dark-surfaceHover hover:text-white'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {tag} ({allTags[tag]})
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-dark-textSecondary">Tags sélectionnés:</span>
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-dark-accent/20 text-dark-accent rounded text-sm"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-2 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <ListSkeleton count={4} />
      ) : results.length > 0 ? (
        <div>
          <p className="text-dark-textSecondary mb-4">
            {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </p>
          <div className="grid gap-4">
            {results.map((lesson, index) => (
              <Link
                key={index}
                to={`/lesson/${lesson.path}`}
                className="block bg-dark-surfaceLight rounded-lg border border-dark-border p-6 hover:border-dark-accent/50 hover:bg-dark-surfaceHover transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-dark-accent transition-colors">
                      {lesson.title}
                    </h2>
                    {lesson.tags && lesson.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {lesson.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-dark-accent/20 text-dark-accent rounded text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <BookOpen className="w-6 h-6 text-dark-textSecondary group-hover:text-dark-accent transition-colors flex-shrink-0 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : query || selectedTags.length > 0 ? (
        <div className="bg-dark-surface rounded-lg border border-dark-border p-12 text-center">
          <Search className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Aucun résultat</h2>
          <p className="text-dark-textSecondary">
            Essayez avec d'autres mots-clés ou tags
          </p>
        </div>
      ) : (
        <div className="bg-dark-surface rounded-lg border border-dark-border p-12 text-center">
          <Search className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Commencez votre recherche</h2>
          <p className="text-dark-textSecondary">
            Entrez un terme de recherche ou sélectionnez des tags pour filtrer les leçons
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchView


