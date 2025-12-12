import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Tag, BookOpen } from 'lucide-react'
import ListSkeleton from './ListSkeleton'
import { fetchWithCache } from '../utils/cache'

function TagView() {
  const [searchParams] = useSearchParams()
  const [tags, setTags] = useState({})
  const [lessons, setLessons] = useState([])
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsData, lessonsData] = await Promise.all([
          fetchWithCache('/api/tags'),
          fetchWithCache('/api/lessons'),
        ])
        setTags(tagsData.tags || {})
        setLessons(lessonsData.lessons || [])
      } catch (err) {
        console.error('Erreur lors du chargement:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredLessons = selectedTag
    ? lessons.filter((lesson) => lesson.tags && lesson.tags.includes(selectedTag))
    : []

  if (loading) {
    return <ListSkeleton count={6} />
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Tags</h1>
        <p className="text-dark-textSecondary">
          {Object.keys(tags).length} tag{Object.keys(tags).length > 1 ? 's' : ''} disponible{Object.keys(tags).length > 1 ? 's' : ''}
        </p>
      </div>

      {Object.keys(tags).length === 0 ? (
        <div className="bg-dark-surface rounded-lg border border-dark-border p-12 text-center">
          <Tag className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Aucun tag trouvé</h2>
          <p className="text-dark-textSecondary">
            Ajoutez des tags dans le frontmatter de vos fichiers Markdown
          </p>
        </div>
      ) : (
        <>
          <div className="bg-dark-surface rounded-lg border border-dark-border p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Tous les tags</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(tags)
                .sort((a, b) => b[1] - a[1])
                .map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedTag === tag
                        ? 'bg-dark-accent text-white'
                        : 'bg-dark-bg text-dark-textSecondary hover:bg-dark-surfaceHover hover:text-white'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>{tag}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                ))}
            </div>
          </div>

          {selectedTag && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Leçons avec le tag "{selectedTag}"
              </h2>
              {filteredLessons.length > 0 ? (
                <div className="grid gap-4">
                  {filteredLessons.map((lesson, index) => (
                    <Link
                      key={index}
                      to={`/lesson/${lesson.path}`}
                      className="block bg-dark-surfaceLight rounded-lg border border-dark-border p-6 hover:border-dark-accent/50 hover:bg-dark-surfaceHover transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-dark-accent transition-colors">
                            {lesson.title}
                          </h3>
                          {lesson.tags && lesson.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {lesson.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${
                                    tag === selectedTag
                                      ? 'bg-dark-accent text-white'
                                      : 'bg-dark-accent/20 text-dark-accent'
                                  }`}
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
              ) : (
                <div className="bg-dark-surface rounded-lg border border-dark-border p-12 text-center">
                  <p className="text-dark-textSecondary">
                    Aucune leçon trouvée avec ce tag
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TagView


