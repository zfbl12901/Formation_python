import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReading } from '../contexts/ReadingContext'

function ReadingLine() {
  const location = useLocation()
  const { showReadingLine } = useReading()

  // Afficher seulement sur les pages de leçon
  if (!location.pathname.startsWith('/lesson/')) {
    return null
  }
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!showReadingLine) return

    const updatePosition = () => {
      const article = document.querySelector('article')
      if (!article) return

      const articleRect = article.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const linePosition = viewportHeight * 0.33 // 1/3 de la hauteur de l'écran

      setPosition(linePosition)
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [showReadingLine])

  if (!showReadingLine) return null

  return (
    <div
      className="fixed left-0 right-0 pointer-events-none z-30"
      style={{ top: `${position}px` }}
    >
      <div className="max-w-4xl mx-auto px-8">
        <div className="border-t border-dark-accent/30 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-3 h-3 bg-dark-accent rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default ReadingLine

