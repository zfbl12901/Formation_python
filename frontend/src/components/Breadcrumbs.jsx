import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

function Breadcrumbs({ items }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className="text-dark-textSecondary hover:text-white transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <ChevronRight className="w-4 h-4 text-dark-textSecondary" />
          {index === items.length - 1 ? (
            <span className="text-white font-medium">{item.title}</span>
          ) : (
            <Link
              to={`/lesson/${item.path}`}
              className="text-dark-textSecondary hover:text-white transition-colors truncate max-w-[200px]"
            >
              {item.title}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs

