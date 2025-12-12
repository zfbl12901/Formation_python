import React from 'react'

function ListSkeleton({ count = 6 }) {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-10 bg-dark-surface rounded-lg w-1/3 mb-2"></div>
        <div className="h-4 bg-dark-surface rounded w-1/2"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-dark-surfaceLight rounded-lg border border-dark-border p-6 animate-pulse"
          >
            <div className="h-6 bg-dark-surface rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-dark-surface rounded w-full mb-2"></div>
            <div className="h-4 bg-dark-surface rounded w-5/6 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-dark-surface rounded-full w-16"></div>
              <div className="h-5 bg-dark-surface rounded-full w-20"></div>
            </div>
            <div className="h-3 bg-dark-surface rounded w-1/3 mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListSkeleton

