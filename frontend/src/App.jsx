import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom'
import { Search, BookOpen, Tag, Menu, X, Home } from 'lucide-react'
import { ReadingProvider, useReading } from './contexts/ReadingContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import LessonView from './components/LessonView'
import LessonList from './components/LessonList'
import SearchView from './components/SearchView'
import TagView from './components/TagView'
import HierarchyView from './components/HierarchyView'
import NavigationMenu from './components/NavigationMenu'
import SidebarSearch from './components/SidebarSearch'
import ScrollToTop from './components/ScrollToTop'
import ThemeToggle from './components/ThemeToggle'
import SkipLinks from './components/SkipLinks'

function AppContent() {
  const { isReadingMode } = useReading()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialiser en fonction du mode lecture sauvegardé
    try {
      const saved = localStorage.getItem('readingMode')
      const savedMode = saved ? JSON.parse(saved) : false
      return !savedMode
    } catch {
      return true
    }
  })
  const [currentView, setCurrentView] = useState('lessons')

  // Synchroniser la sidebar avec le mode lecture
  useEffect(() => {
    setSidebarOpen(!isReadingMode)
  }, [isReadingMode])

  return (
    <Router>
      <AppRouterContent 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isReadingMode={isReadingMode}
      />
    </Router>
  )
}

function AppRouterContent({ sidebarOpen, setSidebarOpen, currentView, setCurrentView, isReadingMode }) {
  const location = useLocation()

  // Scroll to top lors du changement de route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  // Raccourcis clavier globaux
  useKeyboardShortcuts({
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder="Rechercher..."]')
      if (searchInput) {
        searchInput.focus()
      }
    },
    onToggleSidebar: () => {
      setSidebarOpen((prev) => !prev)
    },
    onScrollToTop: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  return (
      <div className="min-h-screen bg-dark-bg flex" style={{ minHeight: '100vh', width: '100%' }}>
        {/* Sidebar */}
        <aside className={`${sidebarOpen && !isReadingMode ? 'w-80' : 'w-0'} bg-dark-surface border-r border-dark-border transition-all duration-300 overflow-hidden flex-shrink-0 flex flex-col`}>
          <div className="p-4 border-b border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-dark-accent" />
                <h1 className="text-xl font-bold text-white">Formation Python</h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-dark-textSecondary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-surfaceHover text-dark-textSecondary hover:text-white transition-colors text-sm"
                onClick={() => setCurrentView('lessons')}
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </Link>
              <Link
                to="/hierarchy"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-surfaceHover text-dark-textSecondary hover:text-white transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span>Hiérarchie</span>
              </Link>
              <Link
                to="/tags"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-surfaceHover text-dark-textSecondary hover:text-white transition-colors text-sm"
              >
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </Link>
              <Link
                to="/search"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-surfaceHover text-dark-textSecondary hover:text-white transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Recherche</span>
              </Link>
            </nav>
          </div>

          {/* Recherche rapide */}
          <div className="p-4 border-b border-dark-border">
            <SidebarSearch />
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            <h2 className="text-sm font-semibold text-dark-textSecondary mb-3 uppercase tracking-wider">
              Chapitres
            </h2>
            <NavigationMenu />
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface border-b border-dark-border dark:border-dark-border light:border-light-border px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-dark-textSecondary dark:text-dark-textSecondary light:text-light-textSecondary hover:text-white dark:hover:text-white light:hover:text-light-text transition-colors focus:outline-none focus:ring-2 focus:ring-dark-accent focus:ring-offset-2 focus:ring-offset-dark-bg rounded p-1"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1"></div>
            <ThemeToggle />
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="page-transition px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<LessonList />} />
                <Route path="/lesson/:path" element={<LessonView />} />
                <Route path="/hierarchy" element={<HierarchyView />} />
                <Route path="/tags" element={<TagView />} />
                <Route path="/search" element={<SearchView />} />
              </Routes>
            </div>
          </div>
        </main>
        <ScrollToTop />
      </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ReadingProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ReadingProvider>
    </ThemeProvider>
  )
}

export default App


