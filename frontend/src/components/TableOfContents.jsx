import React, { useState, useEffect } from 'react'
import { List } from 'lucide-react'

function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    let observer = null
    const observedElements = []

    // Attendre que le contenu soit rendu dans le DOM
    const timer = setTimeout(() => {
      const markdownContent = document.querySelector('.markdown-content')
      if (!markdownContent) return

      const headingElements = markdownContent.querySelectorAll('h1, h2, h3, h4')
      
      const extractedHeadings = Array.from(headingElements).map((heading, index) => {
        let id = heading.id
        if (!id) {
          id = `heading-${index}-${heading.textContent?.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          heading.id = id
        }
        return {
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        }
      })
      
      setHeadings(extractedHeadings)

      // Observer pour détecter le titre actif lors du scroll
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: '-20% 0% -70% 0%' }
      )

      extractedHeadings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.observe(element)
          observedElements.push(element)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      if (observer) {
        observedElements.forEach((element) => {
          observer.unobserve(element)
        })
      }
    }
  }, [content])

  if (headings.length === 0) {
    return null
  }

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  return (
    <div className="bg-dark-surfaceLight rounded-lg border border-dark-border p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-dark-accent" />
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Table des matières</h2>
      </div>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={`block w-full text-left px-3 py-1.5 rounded transition-colors text-sm ${
              activeId === heading.id
                ? 'bg-dark-accent/20 text-dark-accent font-medium'
                : 'text-dark-textSecondary hover:text-white hover:bg-dark-surfaceHover'
            }`}
            style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default TableOfContents

