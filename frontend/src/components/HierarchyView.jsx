import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, BookOpen, Tag } from 'lucide-react'
import ListSkeleton from './ListSkeleton'
import { fetchWithCache } from '../utils/cache'

function HierarchyView() {
  const [hierarchy, setHierarchy] = useState([])
  const [expanded, setExpanded] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const data = await fetchWithCache('/api/hierarchy')
        setHierarchy(data.hierarchy || [])
        // Expand all by default
        const allPaths = []
        const collectPaths = (items) => {
          items.forEach((item) => {
            allPaths.push(item.path)
            if (item.children && item.children.length > 0) {
              collectPaths(item.children)
            }
          })
        }
        collectPaths(data.hierarchy || [])
        setExpanded(new Set(allPaths))
      } catch (err) {
        console.error('Erreur lors du chargement de la hiérarchie:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHierarchy()
  }, [])

  const toggleExpand = (path) => {
    setExpanded((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const renderLesson = (lesson, level = 0) => {
    const hasChildren = lesson.children && lesson.children.length > 0
    const isExpanded = expanded.has(lesson.path)

    return (
      <div key={lesson.path} className="mb-2">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-dark-surfaceHover transition-colors ${
            level > 0 ? 'ml-6' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(lesson.path)}
              className="text-dark-textSecondary hover:text-white transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          <Link
            to={`/lesson/${lesson.path}`}
            className="flex-1 flex items-center gap-3 group"
          >
            <BookOpen className="w-5 h-5 text-dark-textSecondary group-hover:text-dark-accent transition-colors" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-dark-accent transition-colors">
                {lesson.title}
              </h3>
              {lesson.tags && lesson.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {lesson.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-dark-accent/20 text-dark-accent rounded text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-6 border-l border-dark-border">
            {lesson.children.map((child) => renderLesson(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <ListSkeleton count={6} />
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Hiérarchie des Leçons</h1>
        <p className="text-dark-textSecondary">
          Organisation hiérarchique de toutes vos leçons
        </p>
      </div>

      {hierarchy.length === 0 ? (
        <div className="bg-dark-surface rounded-lg border border-dark-border p-12 text-center">
          <BookOpen className="w-16 h-16 text-dark-textSecondary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Aucune leçon trouvée</h2>
          <p className="text-dark-textSecondary">
            Ajoutez des fichiers Markdown dans le dossier <code className="bg-dark-bg px-2 py-1 rounded">content/</code>
          </p>
        </div>
      ) : (
        <div className="bg-dark-surface rounded-lg border border-dark-border p-6">
          {hierarchy.map((lesson) => renderLesson(lesson))}
        </div>
      )}
    </div>
  )
}

export default HierarchyView


