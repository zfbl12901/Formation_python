import React from 'react'
import { useLocation } from 'react-router-dom'

function SkipLinks() {
  const location = useLocation()

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="skip-link"
      >
        Aller au contenu principal
      </a>
      {location.pathname.startsWith('/lesson/') && (
        <a
          href="#lesson-content"
          className="skip-link"
        >
          Aller au contenu de la leçon
        </a>
      )}
      <a
        href="#navigation"
        className="skip-link"
      >
        Aller à la navigation
      </a>
    </div>
  )
}

export default SkipLinks

