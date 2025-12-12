import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { marked } from 'marked'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-sql'
import Breadcrumbs from './Breadcrumbs'
import TableOfContents from './TableOfContents'
import ScrollProgress from './ScrollProgress'
import ReadingProgress from './ReadingProgress'
import ReadingControls from './ReadingControls'
import ReadingLine from './ReadingLine'
import ExportPDF from './ExportPDF'
import LessonSkeleton from './LessonSkeleton'
import { useReading } from '../contexts/ReadingContext'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useToast } from '../contexts/ToastContext'
import { usePreloadNextLesson } from '../hooks/usePreload'
import { fetchWithCache } from '../utils/cache'

function LessonView() {
  const { path } = useParams()
  const navigate = useNavigate()
  const { fontSize, showReadingLine } = useReading()
  const { success, error: showError } = useToast()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [navigation, setNavigation] = useState(null)
  const contentRef = useRef(null)

  // Tous les hooks doivent être appelés avant les retours conditionnels
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true)
        
        // Utiliser le cache intelligent
        const [lessonData, navData] = await Promise.all([
          fetchWithCache(`/api/lessons/${path}`),
          fetchWithCache(`/api/navigation/${path}`)
        ])
        
        setLesson(lessonData)
        setNavigation(navData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [path])

  // Précharger la leçon suivante
  usePreloadNextLesson(navigation)

  // Préparer le contenu HTML (doit être fait avant les retours conditionnels)
  const htmlContent = lesson ? (() => {
    // Configuration de marked pour gérer les blocs de code avec Prism
    const renderer = new marked.Renderer()
    
    renderer.code = (code, language) => {
      const lang = language || 'text'
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
      // Encoder le code pour éviter les problèmes avec les caractères spéciaux
      const encodedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<div class="code-block-wrapper" data-code-id="${codeId}" data-language="${lang}">
        <div class="code-block-header">
          <span class="code-language">${lang}</span>
          <button class="code-copy-btn" data-code="${encodeURIComponent(code)}" title="Copier">
            <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg class="check-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
        <pre class="language-${lang}"><code class="language-${lang}">${encodedCode}</code></pre>
      </div>`
    }

    // Ajouter le lazy loading aux images
    renderer.image = (href, title, text) => {
      return `<img src="${href}" alt="${text || ''}" title="${title || ''}" loading="lazy" />`
    }

    return marked(lesson.content, {
      breaks: true,
      gfm: true,
      renderer: renderer
    })
  })() : ''

  // Appliquer Prism.js et gérer les boutons de copie après le rendu
  // Ce hook doit être appelé à chaque rendu, même si lesson est null
  useEffect(() => {
    if (!contentRef.current || !lesson) return

    // Appliquer la coloration syntaxique
    const codeBlocks = contentRef.current.querySelectorAll('pre code[class*="language-"]')
    codeBlocks.forEach((block) => {
      Prism.highlightElement(block)
    })

    // Gérer les boutons de copie
    const copyButtons = contentRef.current.querySelectorAll('.code-copy-btn')
    const handleCopy = async (btn) => {
      const code = decodeURIComponent(btn.getAttribute('data-code'))
      try {
        await navigator.clipboard.writeText(code)
        const copyIcon = btn.querySelector('.copy-icon')
        const checkIcon = btn.querySelector('.check-icon')
        copyIcon?.classList.add('hidden')
        checkIcon?.classList.remove('hidden')
        btn.classList.add('copied')
        
        // Afficher un toast de confirmation
        success('Code copié dans le presse-papiers')
        
        setTimeout(() => {
          copyIcon?.classList.remove('hidden')
          checkIcon?.classList.add('hidden')
          btn.classList.remove('copied')
        }, 2000)
      } catch (err) {
        console.error('Erreur lors de la copie:', err)
        showError('Erreur lors de la copie')
      }
    }
    
    copyButtons.forEach((btn) => {
      // Cloner le bouton pour retirer les anciens listeners
      const newBtn = btn.cloneNode(true)
      btn.parentNode.replaceChild(newBtn, btn)
      newBtn.addEventListener('click', () => handleCopy(newBtn))
    })

    // Lazy loading pour les images
    const images = contentRef.current.querySelectorAll('img')
    images.forEach((img) => {
      if (img.complete) {
        img.classList.add('loaded')
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded')
        })
        img.addEventListener('error', () => {
          img.classList.add('loaded') // Afficher quand même pour éviter le placeholder permanent
        })
      }
    })
  }, [htmlContent, lesson, success])

  // Navigation avec raccourcis clavier
  useKeyboardShortcuts({
    onPrevious: navigation?.previous ? () => {
      navigate(`/lesson/${navigation.previous.path}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } : null,
    onNext: navigation?.next ? () => {
      navigate(`/lesson/${navigation.next.path}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } : null,
    onScrollToTop: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  // Maintenant on peut faire les retours conditionnels
  if (loading) {
    return <LessonSkeleton />
  }

  if (error || !lesson) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">Erreur: {error || 'Leçon non trouvée'}</p>
          <Link to="/" className="text-dark-accent hover:underline mt-2 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <ScrollProgress />
      <ReadingProgress />
      <ReadingLine />
      <ReadingControls />
      <div className="max-w-4xl mx-auto p-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-dark-textSecondary hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </Link>

        {navigation && navigation.breadcrumb && (
          <Breadcrumbs items={navigation.breadcrumb} />
        )}

        <article className="bg-dark-surface rounded-lg border border-dark-border p-8" id="lesson-content">
          <header className="mb-8 pb-6 border-b border-dark-border">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold text-white flex-1">{lesson.title}</h1>
              <div className="flex items-center gap-2 print:hidden">
                <ExportPDF lesson={lesson} htmlContent={htmlContent} />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-dark-textSecondary">
              {lesson.last_modified && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Modifié le {new Date(lesson.last_modified).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {lesson.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/tags?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-dark-accent/20 text-dark-accent rounded-full text-sm hover:bg-dark-accent/30 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <TableOfContents content={htmlContent} />

          <div
            ref={contentRef}
            className="markdown-content prose prose-invert max-w-none"
            style={{ '--reading-font-size': `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        {/* Navigation précédent/suivant */}
        {navigation && (navigation.previous || navigation.next) && (
          <nav className="mt-8 pt-8 border-t border-dark-border flex gap-4">
            {navigation.previous ? (
              <Link
                to={`/lesson/${navigation.previous.path}`}
                className="flex-1 group bg-dark-surfaceLight rounded-lg border border-dark-border p-4 hover:border-dark-accent/50 hover:bg-dark-surfaceHover transition-all"
              >
                <div className="flex items-center gap-2 text-sm text-dark-textSecondary mb-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </div>
                <div className="text-white font-medium group-hover:text-dark-accent transition-colors">
                  {navigation.previous.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            
            {navigation.next ? (
              <Link
                to={`/lesson/${navigation.next.path}`}
                className="flex-1 group bg-dark-surfaceLight rounded-lg border border-dark-border p-4 hover:border-dark-accent/50 hover:bg-dark-surfaceHover transition-all text-right"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-dark-textSecondary mb-1">
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <div className="text-white font-medium group-hover:text-dark-accent transition-colors">
                  {navigation.next.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        )}
      </div>
    </>
  )
}

export default LessonView


