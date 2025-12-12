import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Tag, Calendar } from 'lucide-react'
import ListSkeleton from './ListSkeleton'
import { fetchWithCache } from '../utils/cache'
import { usePreloadLessons } from '../hooks/usePreload'

function LessonList() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await fetchWithCache('/api/lessons')
        setLessons(data.lessons || [])
      } catch (err) {
        console.error('Erreur lors du chargement des leçons:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  // Précharger les premières leçons
  usePreloadLessons(lessons.slice(0, 5).map(lesson => lesson.path))

  if (loading) {
    return <ListSkeleton count={6} />
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Toutes les Leçons</h1>
        <p className="text-dark-textSecondary">
          {lessons.length} leçon{lessons.length > 1 ? 's' : ''} disponible{lessons.length > 1 ? 's' : ''}
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="bg-dark-surface rounded-lg border border-dark-border p-12 text-center">
          <BookOpen className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Aucune leçon trouvée</h2>
          <p className="text-dark-textSecondary">
            Ajoutez des fichiers Markdown dans le dossier <code className="bg-dark-bg px-2 py-1 rounded">content/</code>
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson, index) => (
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
                    <div className="flex flex-wrap gap-2 mb-3">
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
                  {lesson.last_modified && (
                    <div className="flex items-center gap-2 text-sm text-dark-textSecondary">
                      <Calendar className="w-4 h-4" />
                      <span>Modifié le {new Date(lesson.last_modified).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
                <BookOpen className="w-6 h-6 text-dark-textSecondary group-hover:text-dark-accent transition-colors flex-shrink-0 ml-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default LessonList


