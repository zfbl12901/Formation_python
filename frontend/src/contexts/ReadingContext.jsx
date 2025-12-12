import React, { createContext, useContext, useState, useEffect } from 'react'

const ReadingContext = createContext()

export const useReading = () => {
  const context = useContext(ReadingContext)
  if (!context) {
    throw new Error('useReading must be used within ReadingProvider')
  }
  return context
}

export const ReadingProvider = ({ children }) => {
  const [isReadingMode, setIsReadingMode] = useState(() => {
    try {
      const saved = localStorage.getItem('readingMode')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem('fontSize')
      return saved ? parseInt(saved) : 16
    } catch {
      return 16
    }
  })

  const [showReadingLine, setShowReadingLine] = useState(() => {
    try {
      const saved = localStorage.getItem('showReadingLine')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    localStorage.setItem('readingMode', JSON.stringify(isReadingMode))
  }, [isReadingMode])

  // Initialiser la variable CSS au chargement
  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`)
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de la taille de police:', err)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('fontSize', fontSize.toString())
      document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la taille de police:', err)
    }
  }, [fontSize])

  useEffect(() => {
    localStorage.setItem('showReadingLine', JSON.stringify(showReadingLine))
  }, [showReadingLine])

  const toggleReadingMode = () => {
    setIsReadingMode((prev) => !prev)
  }

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24))
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  const resetFontSize = () => {
    setFontSize(16)
  }

  const toggleReadingLine = () => {
    setShowReadingLine((prev) => !prev)
  }

  return (
    <ReadingContext.Provider
      value={{
        isReadingMode,
        fontSize,
        showReadingLine,
        toggleReadingMode,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleReadingLine
      }}
    >
      {children}
    </ReadingContext.Provider>
  )
}

