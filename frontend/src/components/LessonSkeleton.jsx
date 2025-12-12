import React from 'react'

function LessonSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-12 bg-dark-surface rounded-lg w-3/4 mb-4"></div>
        <div className="h-4 bg-dark-surface rounded w-1/4 mb-2"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-dark-surface rounded-full w-20"></div>
          <div className="h-6 bg-dark-surface rounded-full w-24"></div>
          <div className="h-6 bg-dark-surface rounded-full w-16"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {/* Paragraphes */}
        <div className="space-y-2">
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-5/6"></div>
        </div>

        {/* Titre */}
        <div className="h-8 bg-dark-surface rounded w-2/3 mt-6"></div>

        {/* Paragraphes */}
        <div className="space-y-2">
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-4/5"></div>
        </div>

        {/* Code block skeleton */}
        <div className="bg-dark-surface rounded-lg p-4 mt-6">
          <div className="h-4 bg-dark-bg rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-dark-bg rounded w-full"></div>
            <div className="h-4 bg-dark-bg rounded w-full"></div>
            <div className="h-4 bg-dark-bg rounded w-3/4"></div>
            <div className="h-4 bg-dark-bg rounded w-full"></div>
            <div className="h-4 bg-dark-bg rounded w-5/6"></div>
          </div>
        </div>

        {/* Titre */}
        <div className="h-6 bg-dark-surface rounded w-1/2 mt-6"></div>

        {/* Liste skeleton */}
        <div className="space-y-2 ml-4">
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-4/5"></div>
        </div>

        {/* Paragraphes */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-full"></div>
          <div className="h-4 bg-dark-surface rounded w-3/4"></div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="mt-8 pt-8 border-t border-dark-border flex gap-4">
        <div className="flex-1 h-20 bg-dark-surface rounded-lg"></div>
        <div className="flex-1 h-20 bg-dark-surface rounded-lg"></div>
      </div>
    </div>
  )
}

export default LessonSkeleton

