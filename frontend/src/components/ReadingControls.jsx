import React from 'react'
import { useLocation } from 'react-router-dom'
import { useReading } from '../contexts/ReadingContext'
import { Maximize2, Minimize2, Type, Minus, Plus, RotateCcw, Eye } from 'lucide-react'

function ReadingControls() {
  const location = useLocation()
  const {
    isReadingMode,
    fontSize,
    showReadingLine,
    toggleReadingMode,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleReadingLine
  } = useReading()

  // Afficher seulement sur les pages de leçon
  if (!location.pathname.startsWith('/lesson/')) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <div className="bg-dark-surface border border-dark-border rounded-lg shadow-lg p-2 flex flex-col gap-1">
        {/* Mode lecture */}
        <button
          onClick={toggleReadingMode}
          className="p-2 rounded hover:bg-dark-surfaceHover transition-colors text-dark-textSecondary hover:text-white"
          title={isReadingMode ? 'Quitter le mode lecture' : 'Mode lecture'}
        >
          {isReadingMode ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>

        {/* Taille de police */}
        <div className="border-t border-dark-border pt-1 flex flex-col gap-1">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={decreaseFontSize}
              className="p-1.5 rounded hover:bg-dark-surfaceHover transition-colors text-dark-textSecondary hover:text-white"
              title="Réduire la taille"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs text-dark-textSecondary px-2 min-w-[3rem] text-center">
              {fontSize}px
            </span>
            <button
              onClick={increaseFontSize}
              className="p-1.5 rounded hover:bg-dark-surfaceHover transition-colors text-dark-textSecondary hover:text-white"
              title="Augmenter la taille"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={resetFontSize}
            className="p-1.5 rounded hover:bg-dark-surfaceHover transition-colors text-dark-textSecondary hover:text-white"
            title="Taille par défaut"
          >
            <RotateCcw className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Ligne de lecture */}
        <div className="border-t border-dark-border pt-1">
          <button
            onClick={toggleReadingLine}
            className={`w-full p-2 rounded transition-colors ${
              showReadingLine
                ? 'bg-dark-accent/20 text-dark-accent'
                : 'hover:bg-dark-surfaceHover text-dark-textSecondary hover:text-white'
            }`}
            title={showReadingLine ? 'Masquer la ligne de lecture' : 'Afficher la ligne de lecture'}
          >
            <Eye className="w-5 h-5 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReadingControls

