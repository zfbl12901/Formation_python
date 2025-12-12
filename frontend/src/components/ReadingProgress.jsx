import React, { useState, useEffect } from 'react'

function ReadingProgress() {
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector('article')
      if (!article) return

      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Calculer la progression de lecture
      const articleBottom = articleTop + articleHeight
      const viewportTop = scrollTop
      const viewportBottom = scrollTop + windowHeight

      if (viewportBottom >= articleTop && viewportTop <= articleBottom) {
        const visibleHeight = Math.min(viewportBottom, articleBottom) - Math.max(viewportTop, articleTop)
        const totalVisible = Math.min(articleHeight, windowHeight)
        const progress = totalVisible > 0 ? (visibleHeight / totalVisible) * 100 : 0
        setReadingProgress(Math.min(100, Math.max(0, progress)))
      } else if (viewportTop > articleBottom) {
        setReadingProgress(100)
      } else {
        setReadingProgress(0)
      }
    }

    window.addEventListener('scroll', updateReadingProgress)
    window.addEventListener('resize', updateReadingProgress)
    updateReadingProgress()

    return () => {
      window.removeEventListener('scroll', updateReadingProgress)
      window.removeEventListener('resize', updateReadingProgress)
    }
  }, [])

  if (readingProgress === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-dark-surface z-40">
      <div
        className="h-full bg-dark-accent transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  )
}

export default ReadingProgress

