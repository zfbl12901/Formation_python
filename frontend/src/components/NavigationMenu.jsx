import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react'

function NavigationMenu() {
  const [hierarchy, setHierarchy] = useState([])
  const [expanded, setExpanded] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const { fetchWithCache } = await import('../utils/cache.js')
        const data = await fetchWithCache('/api/hierarchy')
        setHierarchy(data.hierarchy || [])
        // Expand les sections principales par défaut
        const mainSections = []
        data.hierarchy?.forEach((item) => {
          mainSections.push(item.path)
        })
        setExpanded(new Set(mainSections))
      } catch (err) {
        console.error('Erreur lors du chargement de la hiérarchie:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHierarchy()
  }, [])

  const toggleExpand = (path, e) => {
    e.preventDefault()
    e.stopPropagation()
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

  const isActive = (path) => {
    return location.pathname === `/lesson/${path}`
  }

  const renderLesson = (lesson, level = 0) => {
    const hasChildren = lesson.children && lesson.children.length > 0
    const isExpanded = expanded.has(lesson.path)
    const active = isActive(lesson.path)

    return (
      <div key={lesson.path} className="mb-0.5">
        <div
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors ${
            active
              ? 'bg-dark-accent/20 text-dark-accent border-l-2 border-dark-accent'
              : 'hover:bg-dark-surfaceHover text-dark-textSecondary hover:text-white'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(lesson.path, e)}
              className="text-dark-textSecondary hover:text-white transition-colors flex-shrink-0 p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <div className="w-3.5" />
          )}
          <Link
            to={`/lesson/${lesson.path}`}
            className="flex-1 flex items-center gap-2 group min-w-0"
          >
            <BookOpen className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-dark-accent' : 'text-dark-textSecondary group-hover:text-dark-accent'}`} />
            <span className={`text-sm truncate ${active ? 'font-semibold text-dark-accent' : 'font-normal'}`}>
              {lesson.title}
            </span>
          </Link>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-dark-border/30">
            {lesson.children.map((child) => renderLesson(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-dark-surfaceHover rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
      {hierarchy.length === 0 ? (
        <p className="text-sm text-dark-textSecondary px-2">Aucune leçon disponible</p>
      ) : (
        hierarchy.map((lesson) => renderLesson(lesson))
      )}
    </div>
  )
}

export default NavigationMenu

